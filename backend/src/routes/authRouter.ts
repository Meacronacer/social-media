import { Router } from "express";
import passport from "passport";
import { body } from "express-validator";
import authController from "../controllers/authController";

const router = Router();

router.post(
  "/sign-up",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  authController.registration.bind(authController)
);

router.post("/sign-in", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.get("/activate/:link", authController.activation.bind(authController));
router.post(
  "/request-password-reset",
  authController.requestPasswordReset.bind(authController)
);
router.get(
  "/validate-reset-token",
  authController.checkResetTokenValidity.bind(authController)
);
router.get("/vefiry-tokens", authController.verifyTokens.bind(authController));
router.post(
  "/reset-password",
  authController.resetPassword.bind(authController)
);

//for refresh refreshToken
router.get("/refresh", authController.refresh.bind(authController));

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.loginWithGoogle.bind(authController)
);

export default router;
