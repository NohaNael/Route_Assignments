import { UserRepository } from "../../DB/repositories/user.repository";
import { notFoundException, unauthorizedException } from "../../Utils/response/error.response";
import { compareValue, hashValue } from "../../Utils/hash/hash.util";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { CONSTANTS } from "../../config/constants";
import { uploadBufferToCloudinary, destroyCloudinaryAsset } from "../../Utils/upload/upload.util";

export const UserService = {
  // update() persists new mobileNumber via model pre-save hook (auto-encrypted).
  async updateAccount(userId: string, dto: UpdateUserDto) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new notFoundException("User not found");

    Object.assign(user, {
      ...(dto.firstName && { firstName: dto.firstName }),
      ...(dto.lastName && { lastName: dto.lastName }),
      ...(dto.gender && { gender: dto.gender }),
      ...(dto.DOB && { DOB: new Date(dto.DOB) }),
      ...(dto.mobileNumber && { mobileNumber: dto.mobileNumber }),
    });

    await user.save(); // triggers pre-save hook to re-encrypt mobileNumber if changed
    return user;
  },

  async getMyAccount(userId: string) {
    // findById -> post("findOne") hook decrypts mobileNumber back to plain text.
    const user = await UserRepository.findById(userId);
    if (!user) throw new notFoundException("User not found");
    return user;
  },

  async getPublicProfile(targetUserId: string) {
    const user = await UserRepository.findById(targetUserId);
    if (!user || user.deletedAt) throw new notFoundException("User not found");

    return {
      username: `${user.firstName} ${user.lastName}`,
      mobileNumber: user.mobileNumber, // already decrypted by model hook
      profilePic: user.profilePic,
      coverPic: user.coverPic,
    };
  },

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await UserRepository.findById(userId);
    if (!user || !user.password) throw new notFoundException("User not found");

    const isMatch = await compareValue(dto.currentPassword, user.password);
    if (!isMatch) throw new unauthorizedException("Current password is incorrect");

    user.password = await hashValue(dto.newPassword);
    user.changeCredentialTime = new Date();
    await user.save();

    return { updated: true };
  },

  async uploadProfilePic(userId: string, file: Express.Multer.File) {
    const media = await uploadBufferToCloudinary(file.buffer, CONSTANTS.CLOUDINARY_FOLDERS.PROFILE_PICS);
    const user = await UserRepository.updateById(userId, { profilePic: media });
    if (!user) throw new notFoundException("User not found");
    return user.profilePic;
  },

  async uploadCoverPic(userId: string, file: Express.Multer.File) {
    const media = await uploadBufferToCloudinary(file.buffer, CONSTANTS.CLOUDINARY_FOLDERS.COVER_PICS);
    const user = await UserRepository.updateById(userId, { coverPic: media });
    if (!user) throw new notFoundException("User not found");
    return user.coverPic;
  },

  async deleteProfilePic(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new notFoundException("User not found");
    await destroyCloudinaryAsset(user.profilePic?.public_id);
    await UserRepository.updateById(userId, { $unset: { profilePic: "" } });
    return { deleted: true };
  },

  async deleteCoverPic(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new notFoundException("User not found");
    await destroyCloudinaryAsset(user.coverPic?.public_id);
    await UserRepository.updateById(userId, { $unset: { coverPic: "" } });
    return { deleted: true };
  },

  async softDeleteAccount(userId: string) {
    const user = await UserRepository.softDeleteById(userId);
    if (!user) throw new notFoundException("User not found");
    return { deleted: true };
  },
};
