import { Router, Request, Response } from "express";
import { UserService } from "./user.service";
import { successResponse } from "../../Utils/response/success.response";
import { asyncHandler } from "../../Middlewares/async-handler.middleware";
import { AppError } from "../../Utils/response/error.response";
import { validateDto } from "../../Middlewares/validation.middleware";
import { authenticate } from "../../Middlewares/auth.middleware";
import { uploadImage } from "../../Middlewares/multer.middleware";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

const usercontroller = Router();

usercontroller.use(authenticate); // every route below requires a logged-in user

usercontroller.patch(
  "/",
  validateDto(UpdateUserDto),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.updateAccount(req.user!._id.toString(), req.body);
    successResponse(res, 200, "Account updated successfully", user);
  })
);

usercontroller.get(
  "/me",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getMyAccount(req.user!._id.toString());
    successResponse(res, 200, "Account data retrieved successfully", user);
  })
);

usercontroller.get(
  "/:userId/profile",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const profile = await UserService.getPublicProfile(userId ?? "");
    successResponse(res, 200, "Profile retrieved successfully", profile);
  })
);

usercontroller.patch(
  "/password",
  validateDto(UpdatePasswordDto),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await UserService.updatePassword(req.user!._id.toString(), req.body);
    successResponse(res, 200, "Password updated successfully", result);
  })
);

usercontroller.post(
  "/profile-pic",
  uploadImage.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("No file uploaded", 422);
    const media = await UserService.uploadProfilePic(req.user!._id.toString(), req.file);
    successResponse(res, 200, "Profile picture uploaded successfully", media);
  })
);

usercontroller.post(
  "/cover-pic",
  uploadImage.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("No file uploaded", 422);
    const media = await UserService.uploadCoverPic(req.user!._id.toString(), req.file);
    successResponse(res, 200, "Cover picture uploaded successfully", media);
  })
);

usercontroller.delete(
  "/profile-pic",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await UserService.deleteProfilePic(req.user!._id.toString());
    successResponse(res, 200, "Profile picture deleted successfully", result);
  })
);

usercontroller.delete(
  "/cover-pic",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await UserService.deleteCoverPic(req.user!._id.toString());
    successResponse(res, 200, "Cover picture deleted successfully", result);
  })
);

usercontroller.delete(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await UserService.softDeleteAccount(req.user!._id.toString());
    successResponse(res, 200, "Account deleted successfully", result);
  })
);

export default usercontroller;
