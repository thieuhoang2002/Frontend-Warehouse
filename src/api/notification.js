import apiClient from "./api-client";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const API_PATH = "/api/notifications";
const WS_URL  = `${process.env.REACT_APP_API_URL}/ws`;

const getNotifications = () =>
  apiClient.get(API_PATH)
    .then((r) => r.data)
    .catch(() => []);

const markAsRead = (id) =>
  apiClient.put(`${API_PATH}/${id}/mark-as-read`)
    .then((r) => r.data)
    .catch(() => null);

const deleteNotification = (id) =>
  apiClient.delete(`${API_PATH}/${id}`)
    .then((r) => r.data)
    .catch(() => null);

const connectWebSocket = (onMessageReceived) => {
  const socket = new SockJS(WS_URL);
  const stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    () => {
      console.log("Connected to WebSocket");
      stompClient.subscribe("/topic/notifications", (message) => {
        const notification = JSON.parse(message.body);
        onMessageReceived(notification);
      });
    },
    (error) => {
      console.error("WebSocket error:", error);
    }
  );

  return () => stompClient.disconnect();
};

const NotificationService = {
  getNotifications,
  markAsRead,
  deleteNotification,
  connectWebSocket,
};

export default NotificationService;
