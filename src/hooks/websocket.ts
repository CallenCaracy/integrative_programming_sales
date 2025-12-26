// useWebSocket.ts
import { useEffect, useRef, useCallback } from "react";
import type { Message } from "@/models/types/chat";

type UseWebSocketProps = {
  roomId: string | null;
  userId: string | null;
  onMessage: (message: Message) => void;
  enabled?: boolean;
};

export default function useWebSocket({
  roomId,
  userId,
  onMessage,
}: UseWebSocketProps) {
  const socketRef = useRef<WebSocket | null>(null);
  const BASE_URL = "ws://localhost:5249/api/v1";

  useEffect(() => {
    if (!roomId || !userId) return;

    const ws = new WebSocket(
      `${BASE_URL}/chat/listen-to-chat-room?roomId=${roomId}&userId=${userId}`
    );
    socketRef.current = ws;

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      try {
        const data: Message =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        onMessage(data);
        console.log("WebSocket message", data);
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error", err);
    ws.onclose = (event) =>
      console.log("WebSocket closed", event.code, event.reason || "");

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "cleanup");
      }
    };
  }, [roomId, userId, onMessage]);

  const sendMessage = useCallback((message: Message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        const send = {
          message: message.message,
          roomId: message.roomId,
          isInventorySender: message.isInventorySender,
        };
        socketRef.current.send(JSON.stringify(send));
      } catch (err) {
        console.error("Error sending message:", err);
      }
    } else {
      console.error(
        "WebSocket is not connected. Current state:",
        socketRef.current?.readyState
      );
    }
  }, []);

  return { sendMessage };
}
