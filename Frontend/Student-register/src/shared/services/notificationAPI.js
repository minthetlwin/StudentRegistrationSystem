import { api } from "../../utils/api";

export const fetchMyNotifications = async () => {
  try {
    const res = await api.get("/api/notifications");
    return res.data;
  } catch (error) {
    console.error("Fetch notifications error:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const res = await api.patch(`/api/notifications/${id}/read`, {});
    return res.data;
  } catch (error) {
    console.error("Mark notification read error:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const res = await api.patch("/api/notifications/mark-all-read", {});
    return res.message;
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    throw error;
  }
};

export const removeNotification = async (id) => {
  try {
    const res = await api.delete(`/api/notifications/${id}`);
    return res.message;
  } catch (error) {
    console.error("Delete notification error:", error);
    throw error;
  }
};
