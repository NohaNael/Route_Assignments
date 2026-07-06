import { unauthorizedResponse } from "../../utils/err.response.js";
import { successResponse } from "../../utils/success.response.js";
import { decrypt } from "../../utils/security/enc.sec.js";
import { findoneandupdate } from "../../DB/db.repo.js";
import User from "../../DB/models/user.model.js";
import { localfileupload } from "../../utils/multer/local.multer.js";


export const getUserProfile = async (req, res) => {
    if (!req.user) {
        throw unauthorizedResponse("unauthorized");
    }

    const user = req.user.toObject ? req.user.toObject() : { ...req.user };

    if (user.phone) {
        user.phone = decrypt(user.phone);
    }

    successResponse({
        res,
        statusCode: 200,
        message: "User profile fetched successfully",
        data: { user },
    });
};

export const updateProfilePic = async (req, res) => {
    const user = await findoneandupdate({ model: User, id: req.user._id, update: { profilePic: req.finalPath } });
    successResponse({
        res,
        statusCode: 200,
        message: "done",
        data: { user },
    });
}

export const updateCoverPic = async (req, res) => {
    const user = await findoneandupdate({ model: User, id: req.user._id, update: { coverPic: req.files ?.map((file) => file.finalPath) } });
    successResponse({
        res,
        statusCode: 200,
        message: "done",
        data: { user },
    });
} 