import { useAuth } from "@/context/authContext";
import { RoomUsers } from "@/models/types/chat";

export function useChat() {
  const { user } = useAuth();

  const fetchChatRoom = async (page: number, pageSize: number) => {
    if (!user?.id) return null;

    const res = await fetch(
      `/api/secure/chat?userId=${user.id}&pageSize=${pageSize}&pageNumber=${page}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch chat room");
    }

    const data: { success: boolean; data: RoomUsers | null } = await res.json();
    return data; // return the object including `data`
  };

  return { fetchChatRoom };
}
