import { Router } from "express";
import {
  googleAuthController,
  loginController,
  signupController,
  userVerify,
} from "../../controller/authController";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/google", googleAuthController);
router.post("/login", loginController);
router.post("/signup", signupController);
router.get("/", auth, userVerify);

export default router;
