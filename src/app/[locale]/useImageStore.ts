import { create } from "zustand";

export type ImageStore = {
  imageUrl: string;
  setImageUrl: (imageUrl: string) => void;
};

const useImageStore = create<ImageStore>((set) => ({
  imageUrl: "",
  setImageUrl: (imageUrl: string): void => set({ imageUrl }),
}));

export default useImageStore;
