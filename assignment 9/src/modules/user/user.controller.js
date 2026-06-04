import { Router } from "express";
import {
	deleteLoggedInUser,
	getLoggedInUserData,
	login,
	signup,
	updateLoggedInUser,
} from "./user.service.js";

const router = Router();

router.get("/use", getLoggedInUserData);
router.post("/", login);
router.post("/signup", signup);
router.patch("/", updateLoggedInUser);
router.delete("/", deleteLoggedInUser);




export default router;