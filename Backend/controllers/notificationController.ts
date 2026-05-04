import Notification from "../models/notification.js";
import logger from "../utils/logger.js";

/**
 * Get all notifications for the authenticated student.
 */
export const getMyNotifications = async (req: any, res: any) => {
  try {
    const studentId = req.student._id;
    const notifications = await Notification.find({ recipient: studentId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error: any) {
    logger.error(`getMyNotifications error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Mark a specific notification as read.
 */
export const markAsRead = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const studentId = req.student._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: studentId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error: any) {
    logger.error(`markAsRead error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Mark all notifications as read for the current student.
 */
export const markAllAsRead = async (req: any, res: any) => {
  try {
    const studentId = req.student._id;

    await Notification.updateMany(
      { recipient: studentId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    logger.error(`markAllAsRead error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Delete a notification.
 */
export const deleteNotification = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const studentId = req.student._id;

    const deleted = await Notification.findOneAndDelete({ _id: id, recipient: studentId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error: any) {
    logger.error(`deleteNotification error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
