import { Router } from "express";
import CommentController from "../controllers/commentController";
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  CommentController.createComment.bind(CommentController)
);

router.patch(
  "/:commentId", // новый эндпоинт для обновления комментария
  authMiddleware,
  CommentController.updateComment.bind(CommentController)
);

router.delete(
  "/:commentId",
  authMiddleware,
  CommentController.deleteComment.bind(CommentController)
);

router.post(
  "/:commentId/like",
  authMiddleware,
  CommentController.toggleLike.bind(CommentController)
);

export default router;
