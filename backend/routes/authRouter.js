const Router = require("express");
const controller = require("../controllers/authController");
const { body } = require("express-validator");
const router = new Router();
const authMiddlWare = require("../middlewares/auth-middleware");

router.post(
  "/sign-up",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  controller.signUp
);
router.post("/sign-in", controller.signIn);
router.post("/logout", controller.logout);
router.get("/activate/:link", controller.activation);
router.get("/refresh", controller.refresh);
router.get("/get-me", controller.getMe);
router.get("/all-users", authMiddlWare, controller.getUsers);

module.exports = router;
