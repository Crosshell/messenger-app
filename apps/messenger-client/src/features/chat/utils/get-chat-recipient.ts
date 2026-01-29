import type { Chat } from '../model/types/chat.type';

export const getChatRecipient = (chat: Chat, currentUserId: string | null) => {
  if (!chat.members || chat.members.length === 0) return null;

  const otherMember = chat.members.find((m) => m.user.id !== currentUserId);

  return otherMember ? otherMember.user : chat.members[0].user;
};
