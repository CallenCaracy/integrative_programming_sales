export interface Message {
  id: number;
  roomId: string;
  isInventorySender: boolean;
  message: string;
  isRead: boolean;
  createdDate: string; // UTC ISO string from backend
}

export interface UserInfoType {
  id: number;
  username: string;
  // add other fields if needed
}

export interface RoomUsers {
  id: number;
  roomId: string;
  initiatorId: number;
  initiator: UserInfoType;
  messages: Message[];
  totalMessages: number;
  unreadMessages: number; // matches double from C# backend
}
