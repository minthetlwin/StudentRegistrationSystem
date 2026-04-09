import express from "express";
import { protectStudent } from "../middleware/authMiddleware.js";
import { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectStudent, getMyNotifications);
router.patch("/:id/read", protectStudent, markAsRead);
router.patch("/mark-all-read", protectStudent, markAllAsRead);
router.delete("/:id", protectStudent, deleteNotification);

export default router;
