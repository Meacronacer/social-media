import { Router } from "express";
import passport from "passport";
import { body } from "express-validator";
import authController from "../controllers/authController";
import userController from "../controllers/userController";
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

router.post(
  "/sign-up",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  authController.signUp.bind(authController)
);

router.post("/sign-in", authController.signIn.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.get("/activate/:link", authController.activation.bind(authController));
router.get("/refresh", authController.refresh.bind(authController));
router.get(
  "/get-me",
  authMiddleware,
  userController.getMe.bind(authController)
);
router.get(
  "/all-users",
  authMiddleware,
  userController.getUsers.bind(authController)
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.handleGoogleCallback.bind(authController)
);

export default router;
