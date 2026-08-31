import {authentication} from "../../Middlewares/authentication.middlewares";
import {validate} from "../../Middlewares/valid.middleware";
import {Router} from "express";
import * as validators from "./user.validation";
import userService from "./user.service";



const router = Router();

router.post("/friend-request/:userID",authentication(),validate(validators.userIdParamsSchema),userService.sendFriendRequest);

router.get("/friend-request",authentication(),userService.listFriendRequests);

router.patch("/friend-request/:requestID/accept",authentication(),validate(validators.RequestIdParamsSchema),userService.acceptFriendRequest);
router.patch("/friend-request/:requestID/reject",authentication(),validate(validators.RequestIdParamsSchema),userService.rejectFriendRequest);

router.delete(
  "/friend/:userID",
  authentication(),
  validate(validators.userIdParamsSchema),
  userService.removeFriend
);

router.patch(
  "/block/:userID",
  authentication(),
  validate(validators.userIdParamsSchema),
  userService.blockUser
);

router.patch(
  "/unblock/:userID",
  authentication(),
  validate(validators.userIdParamsSchema),
  userService.UnblockUser
);

export default router;