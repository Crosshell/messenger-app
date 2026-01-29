export interface MessageDeletedResponse {
  messageId: string;
  chatId: string;
  senderId: string;
  isRead: boolean;
}
