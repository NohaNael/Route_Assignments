import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import noteModel from "../../db/models/notes.model.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "assignment-9-jwt-secret";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getTokenFromHeaders = (headers) => {
	const authorizationHeader = headers.authorization ?? headers.Authorization;
	if (typeof authorizationHeader === "string" && authorizationHeader.startsWith("Bearer ")) {
		return authorizationHeader.slice(7);
	}

	if (typeof authorizationHeader === "string" && authorizationHeader.length > 0) {
		return authorizationHeader;
	}

	const headerToken = headers.token ?? headers.Token;
	if (typeof headerToken === "string" && headerToken.length > 0) {
		return headerToken;
	}

	return null;
};

export const createNote = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const note = new noteModel({
			...req.body,
			userID: payload.userId,
		});
		await note.save();
		return res.status(201).json({ message: "Note created successfully", note });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error creating note", error: error.message });
	}
};

export const getPaginatedSortedNotes = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
		const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
		const skip = (page - 1) * limit;

		const [notes, totalNotes] = await Promise.all([
			noteModel
				.find({ userID: payload.userId })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			noteModel.countDocuments({ userID: payload.userId }),
		]);

		return res.status(200).json({
			message: "Paginated notes fetched successfully",
			pagination: {
				page,
				limit,
				totalNotes,
				totalPages: Math.ceil(totalNotes / limit),
			},
			notes,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching paginated notes",
			error: error.message,
		});
	}
};

export const getNoteById = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid note id" });
		}

		const note = await noteModel.findOne({
			_id: id,
			userID: payload.userId,
		});

		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}

		return res.status(200).json({ message: "Note fetched successfully", note });
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching note by id",
			error: error.message,
		});
	}
};

export const getNoteByContent = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const content = String(req.query.content ?? "").trim();
		if (!content) {
			return res.status(400).json({ message: "Query parameter 'content' is required" });
		}

		const contentPattern = new RegExp(escapeRegex(content), "i");

		const note = await noteModel.findOne({
			userID: payload.userId,
			content: { $regex: contentPattern },
		});

		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}

		return res.status(200).json({ message: "Note fetched successfully", note });
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching note by content",
			error: error.message,
		});
	}
};

export const getNotesWithUserInfo = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const notes = await noteModel.aggregate([
			{
				$match: {
					userID: new mongoose.Types.ObjectId(payload.userId),
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "userID",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{
				$project: {
					_id: 0,
					title: 1,
					userId: "$userID",
					createdAt: 1,
					"user.email": 1,
				},
			},
		]);

		return res.status(200).json({
			message: "Notes with user info fetched successfully",
			notes,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching notes with user info",
			error: error.message,
		});
	}
};

export const getAggregatedNotes = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const title = String(req.query.title ?? "").trim();
		const matchStage = {
			userID: new mongoose.Types.ObjectId(payload.userId),
		};

		if (title) {
			matchStage.title = { $regex: new RegExp(escapeRegex(title), "i") };
		}

		const notes = await noteModel.aggregate([
			{ $match: matchStage },
			{
				$lookup: {
					from: "users",
					localField: "userID",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{
				$project: {
					_id: 1,
					title: 1,
					content: 1,
					createdAt: 1,
					updatedAt: 1,
					user: {
						name: "$user.name",
						email: "$user.email",
					},
				},
			},
			{ $sort: { createdAt: -1 } },
		]);

		return res.status(200).json({
			message: "Aggregated notes fetched successfully",
			count: notes.length,
			notes,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching aggregated notes",
			error: error.message,
		});
	}
};

export const updateNoteById = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const { noteId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(noteId)) {
			return res.status(400).json({ message: "Invalid note id" });
		}

		const updates = { ...req.body };
		delete updates.userID;
		delete updates._id;

		const note = await noteModel.findOneAndUpdate(
			{ _id: noteId, userID: payload.userId },
			updates,
			{ new: true, runValidators: true }
		);

		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}

		return res.status(200).json({ message: "Note updated successfully", note });
	} catch (error) {
		return res.status(500).json({
			message: "Error updating note",
			error: error.message,
		});
	}
};

export const replaceNoteById = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const { noteId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(noteId)) {
			return res.status(400).json({ message: "Invalid note id" });
		}

		const requestBody = req.body ?? {};
		const title = String(requestBody.title ?? "").trim();
		const content = String(requestBody.content ?? "").trim();
		if (!title || !content) {
			return res.status(400).json({
				message:
					"Both title and content are required for full note replacement. Send JSON body with Content-Type: application/json",
			});
		}

		const replacementNote = {
			...requestBody,
			title,
			content,
			userID: payload.userId,
		};
		delete replacementNote._id;

		const note = await noteModel.findOneAndReplace(
			{ _id: noteId, userID: payload.userId },
			replacementNote,
			{ new: true, runValidators: true }
		);

		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}

		return res.status(200).json({ message: "Note replaced successfully", note });
	} catch (error) {
		return res.status(500).json({
			message: "Error replacing note",
			error: error.message,
		});
	}
};

export const updateAllNotesTitle = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const newTitle = String(req.body.title ?? req.body.newTitle ?? "").trim();
		if (!newTitle) {
			return res.status(400).json({ message: "New title is required" });
		}

		const result = await noteModel.updateMany(
			{ userID: payload.userId },
			{ $set: { title: newTitle } },
			{ runValidators: true }
		);

		return res.status(200).json({
			message: "All note titles updated successfully",
			matchedCount: result.matchedCount,
			modifiedCount: result.modifiedCount,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error updating all note titles",
			error: error.message,
		});
	}
};

export const deleteNoteById = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const { noteId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(noteId)) {
			return res.status(400).json({ message: "Invalid note id" });
		}

		const note = await noteModel.findOneAndDelete({
			_id: noteId,
			userID: payload.userId,
		});

		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}

		return res.status(200).json({ message: "Note deleted successfully", note });
	} catch (error) {
		return res.status(500).json({
			message: "Error deleting note",
			error: error.message,
		});
	}
};

export const deleteAllLoggedInUserNotes = async (req, res) => {
	try {
		const token = getTokenFromHeaders(req.headers);
		if (!token) {
			return res.status(401).json({ message: "Missing authentication token" });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const result = await noteModel.deleteMany({ userID: payload.userId });

		return res.status(200).json({
			message: "All logged-in user notes deleted successfully",
			deletedCount: result.deletedCount,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error deleting user notes",
			error: error.message,
		});
	}
};
