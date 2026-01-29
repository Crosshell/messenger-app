import { create } from 'zustand';

interface UIState {
  previewImage: { url: string; filename: string } | null;
  setPreviewImage: (image: { url: string; filename: string } | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  previewImage: null,
  setPreviewImage: (image) => set({ previewImage: image }),
}));
