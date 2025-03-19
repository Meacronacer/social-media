import { Router } from "express";
import multer from "multer";
import userController from "../controllers/userController";
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

// Используем Multer с хранением в памяти
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/get-me",
  authMiddleware,
  userController.getMe.bind(userController)
);
router.get(
  "/all-users",
  authMiddleware,
  userController.getUsers.bind(userController)
);
router.get(
  "/:userId",
  authMiddleware,
  userController.getUser.bind(userController)
);

router.post(
  "/update-profile",
  authMiddleware,
  upload.single("avatar"),
  userController.updateProfileController.bind(userController)
);

export default router;
