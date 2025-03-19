import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import chatController from "../controllers/chatController";
const router = Router();

router.get("/active", authMiddleware, chatController.getActiveChats);
router.get("/:chatId/messages", chatController.getMessagesBetweenTwoUsers);
router.get(
  "/unread-count",
  authMiddleware,
  chatController.getUnreadCount.bind(chatController)
);

export default router;
