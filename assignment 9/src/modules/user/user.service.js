import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import userModel from "../../db/models/user.model.js";

const PHONE_ENCRYPTION_SECRET =
	process.env.PHONE_ENCRYPTION_SECRET ?? "assignment-9-phone-secret";
const JWT_SECRET = process.env.JWT_SECRET ?? "assignment-9-jwt-secret";

const hashPassword = (password) => {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto.scryptSync(password, salt, 64).toString("hex");
	return `${salt}:${hash}`;
};

const encryptPhone = (phone) => {
	const iv = crypto.randomBytes(16);
	const key = crypto.createHash("sha256").update(PHONE_ENCRYPTION_SECRET).digest();
	const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
	const encrypted = Buffer.concat([
		cipher.update(String(phone), "utf8"),
		cipher.final(),
	]).toString("hex");

	return `${iv.toString("hex")}:${encrypted}`;
};

const verifyPassword = (password, storedPassword) => {
	const [salt, storedHash] = String(storedPassword).split(":");
	if (!salt || !storedHash) {
		return false;
	}

	const hash = crypto.scryptSync(password, salt, 64).toString("hex");
	const storedBuffer = Buffer.from(storedHash, "hex");
	const hashBuffer = Buffer.from(hash, "hex");

	return storedBuffer.length === hashBuffer.length && crypto.timingSafeEqual(storedBuffer, hashBuffer);
};

const getTokenFromHeaders = (headers) => {
	const authorizationHeader = headers.authorization ?? headers.Authorization;
	if (
		typeof authorizationHeader === "string" &&
		authorizationHeader.startsWith("Bearer ")
	) {
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

export const signup = async (req, res) => {
	try {
		const { name, email, password, age, phone } = req.body;

		const normalizedEmail = String(email).trim().toLowerCase();
		const existingUser = await userModel.findOne({ email: normalizedEmail });

		if (existingUser) {
			return res.status(409).json({ message: "Email already exists" });
		}

		const user = await userModel.create({
			name,
			email: normalizedEmail,
			password: hashPassword(password),
			age,
			phone: encryptPhone(phone),
		});

		const createdUser = user.toObject();
		delete createdUser.password;

		return res.status(201).json({
			message: "User signed up successfully",
			user: createdUser,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error signing up user",
			error: error.message,
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				message: "Email and password are required",
			});
		}

		const normalizedEmail = String(email).trim().toLowerCase();

		const user = await userModel.findOne({ email: normalizedEmail });
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		if (!verifyPassword(password, user.password)) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
			expiresIn: "1h",
		});

		return res.status(200).json({
			message: "Login successful",
			token,
			userId: user._id,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error logging in user",
			error: error.message,
		});
	}
};

export const getLoggedInUserData = async (req, res) => {
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

		const user = await userModel.findById(payload.userId).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({
			message: "Logged-in user data fetched successfully",
			user,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching logged-in user data",
			error: error.message,
		});
	}
};

export const updateLoggedInUser = async (req, res) => {
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

		const updates = { ...req.body };
		if (Object.prototype.hasOwnProperty.call(updates, "password")) {
			return res.status(400).json({ message: "Password update is not allowed here" });
		}

		if (Object.prototype.hasOwnProperty.call(updates, "email")) {
			const normalizedEmail = String(updates.email).trim().toLowerCase();
			if (!normalizedEmail) {
				return res.status(400).json({ message: "Email cannot be empty" });
			}

			const existingUser = await userModel.findOne({
				email: normalizedEmail,
				_id: { $ne: payload.userId },
			});

			if (existingUser) {
				return res.status(409).json({ message: "Email already exists" });
			}

			updates.email = normalizedEmail;
		}

		const updatedUser = await userModel
			.findByIdAndUpdate(payload.userId, updates, {
				new: true,
				runValidators: true,
			})
			.select("-password");

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({
			message: "User updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error updating user",
			error: error.message,
		});
	}
};

export const deleteLoggedInUser = async (req, res) => {
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

		const deletedUser = await userModel.findByIdAndDelete(payload.userId).select("-password");
		if (!deletedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({
			message: "User deleted successfully",
			user: deletedUser,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error deleting user",
			error: error.message,
		});
	}
};