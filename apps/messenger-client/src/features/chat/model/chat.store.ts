import { create } from 'zustand';
import type { Message } from './types/message.type.ts';

interface ChatState {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  messageToEdit: Message | null;
  setMessageToEdit: (message: Message | null) => void;
  messageToReply: Message | null;
  setMessageToReply: (message: Message | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeChatId: null,
  messageToEdit: null,
  messageToReply: null,

  setActiveChatId: (id) => set({ activeChatId: id }),
  setMessageToEdit: (message) =>
    set({ messageToEdit: message, messageToReply: null }),
  setMessageToReply: (message) =>
    set({ messageToReply: message, messageToEdit: null }),
}));
