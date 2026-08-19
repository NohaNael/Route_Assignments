import { Router} from "express";
import AuthService from "./auth.service";
import * as validators from "./auth.valid";
import {validate} from "../../Middlewares/valid.middleware";



const router=Router();

router.post("/signup",validate(validators.signUpSchema),AuthService.signup);
router.patch("/confirm-email",validate(validators.confirmEmailSchema),AuthService.confirmEmail);
router.post("/login",validate(validators.loginSchema),AuthService.login);
export default router;




