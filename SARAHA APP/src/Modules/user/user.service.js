import { unauthorizedResponse, notFoundResponse, forbiddenResponse } from "../../utils/err.response.js";
import { successResponse } from "../../utils/success.response.js";
import { decrypt } from "../../utils/security/enc.sec.js";
import { findbyid, findoneandupdate, updateone, deleteone } from "../../DB/db.repo.js";
import User from "../../DB/models/user.model.js";
import { compareHash, generateHash } from "../../utils/security/hash.security.js";
import { hashenum } from "../../utils/enums/sec.enum.js";
import { UserRole } from "../../utils/enums/user.enum.js";


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

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  

    const isvalidPassword = await compareHash({plain_text:oldPassword,cipher_text:req.user.password,algorithm:hashenum.ARGON2});

    if (!isvalidPassword) {
        throw unauthorizedResponse("unauthorized");
    }
    const hashedPassword = await generateHash({plain_text:newPassword,algorithm:hashenum.ARGON2});
    await updateone({ model: User, filter: { _id: req.user._id }, update: { password: hashedPassword, changeCredentialsTime: new Date() } });
    successResponse({
        res,
        statusCode: 200,
        message: "Password updated successfully",
    });


}


export const freezeAccount = async (req, res) => {
    const { userID } = req.params;
    const targetuserID = userID || req.user._id;

    if(targetuserID.toString() !== req.user._id.toString() && req.user.role !== UserRole.ADMIN)
        throw unauthorizedResponse("unauthorized");

    const updatedUser = await findoneandupdate({
        model: User,
        filter: { _id: targetuserID, freezedAt: { $exists: false } },
        update: { freezedBy: req.user._id, freezedAt: new Date(), freezedByRole: req.user.role, $unset: { restoredBy: true, restoredAt: true } }
    });

    if (!updatedUser)
        throw notFoundResponse("user not found or already freezed");

    successResponse({
        res,
        statusCode: 200,
        message: "Account freezed successfully",
    });

}

export const restoreAccount = async (req, res) => {
    const { userID } = req.params;
    const targetuserID = userID || req.user._id;

    const user= await findbyid({model:User,id:targetuserID});
    if(!user||!user.freezedAt)
        throw notFoundResponse("user not found");

    if(user.freezedByRole === UserRole.ADMIN){
        if(req.user.role !== UserRole.ADMIN)
            throw forbiddenResponse("account freezed by admin only can be restored by admin");
    } else {
        if(targetuserID.toString() !== req.user._id.toString() && req.user.role !== UserRole.ADMIN)
            throw unauthorizedResponse("unauthorized");
    }

    const updatedUser = await findoneandupdate({
        model: User,
        filter: { _id: targetuserID, freezedAt: { $exists: true } },
        update: { restoredBy: req.user._id, restoredAt: new Date(), $unset: { freezedBy: true, freezedAt: true, freezedByRole: true } }
    });


    successResponse({
        res,
        statusCode: 200,
        message: "Account restored successfully",
        data: updatedUser,
    })
};

export const hardDeleteAccount = async (req, res) => {
    const { userID } = req.params;

    const result = await deleteone({ model: User, filter: { _id: userID } });

    if (!result.deletedCount)
        throw notFoundResponse("user not found");

    successResponse({
        res,
        statusCode: 200,
        message: "Account deleted successfully",
    });
}

