// Chat.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useChat } from "@/hooks/chat";
import useWebSocket from "@/hooks/websocket";
import type { Message, RoomUsers } from "@/models/types/chat";

export function Chat() {
  const { user } = useAuth();
  const { fetchChatRoom } = useChat();

  const [room, setRoom] = useState<RoomUsers | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const roomIdUUID = useRef<string>(uuidv4());
  const roomId = room?.roomId || roomIdUUID.current;

  useEffect(() => {
    if (!user?.id) return;

    const fetchRoom = async () => {
      try {
        const res = await fetchChatRoom(page, pageSize);

        if (!res?.success || !res.data) {
          setRoom(null);
          setMessages([]);
          return;
        }

        setRoom(res.data);
        setMessages((prev) => {
          const newMessages = res.data?.messages ?? [];
          return page === 1 ? newMessages : [...newMessages, ...prev];
        });
      } catch (err) {
        console.error("Failed to fetch room", err);
      }
    };

    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleIncomingMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { sendMessage } = useWebSocket({
    roomId,
    userId: user?.id ?? null,
    onMessage: handleIncomingMessage,
  });

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage({
      message: input,
      isInventorySender: false,
      roomId: roomId,
      id: -1,
      createdDate: "",
      isRead: false,
    });

    setInput("");
  };

  return (
    <Card className="flex h-[600px] flex-col rounded-none">
      {/* Header */}
      <CardHeader className="border-b font-semibold">
        Chat With Kentward
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 px-4 py-3 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                There&apos;s no messages
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = !msg.isInventorySender;
                return (
                  <div
                    key={msg.id || uuidv4()} // ensure unique key
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                        isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div>{msg.message}</div>
                      <div className="mt-1 text-xs opacity-70">
                        {msg.createdDate
                          ? new Date(msg.createdDate).toLocaleTimeString()
                          : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="border-t p-3 rounded-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" className="hover:text-white">
            Send
          </Button>
        </form>
      </div>
    </Card>
  );
}
