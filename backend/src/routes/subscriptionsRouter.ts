import { Router } from "express";
import SubscriptionController from "../controllers/subscriptionController";
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

router.post(
  "/subscribe",
  authMiddleware,
  SubscriptionController.subscribe.bind(SubscriptionController)
);
router.post(
  "/unsubscribe",
  authMiddleware,
  SubscriptionController.unsubscribe.bind(SubscriptionController)
);
router.get(
  "/:userId/followers",
  authMiddleware,
  SubscriptionController.getFollowers.bind(SubscriptionController)
);
router.get(
  "/:userId/following",
  authMiddleware,
  SubscriptionController.getFollowing.bind(SubscriptionController)
);

router.get(
  "/relationship-status/:targetUserId",
  authMiddleware,
  SubscriptionController.getRelationshipStatus.bind(SubscriptionController)
);

export default router;
