import { Router } from "express";
import PostController from "../controllers/postController";
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

router.get(
  "/all-posts/:userId",
  authMiddleware,
  PostController.getPostsPaginated.bind(PostController)
);
router.post(
  "/create",
  authMiddleware,
  PostController.createPost.bind(PostController)
);
router.delete(
  "/:postId",
  authMiddleware,
  PostController.deletePost.bind(PostController)
);

router.patch(
  "/:postId", // новый эндпоинт для обновления поста
  authMiddleware,
  PostController.updatePost.bind(PostController)
);

router.post(
  "/:postId/like",
  authMiddleware,
  PostController.toggleLike.bind(PostController)
);

export default router;
