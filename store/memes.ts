import { create } from "zustand";
import Cookies from "js-cookie";

interface MemeType {
  id: number;
  name: string;
  image: string;
  likesCount: number;
  likes: number;
}

export const loadMemes = async (): Promise<MemeType[] | null> => {
  try {
    const response = await fetch("/api/memes");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    Cookies.set("memes", JSON.stringify(data), { expires: 7 });
    useMemeStore.getState().setMemes(data);
    return data;
  } catch (error) {
    console.error("Failed to load memes:", error);
    return null;
  }
};

type MemeStore = {
  memes: MemeType[];
  setMemes: (memes: MemeType[]) => void;
  updateOneMeme: (meme: MemeType) => void;
};

const loadOrFetchMemes = async () => {
  const cachedMemes = Cookies.get("memes");
  if (cachedMemes) {
    const parsedMemes = JSON.parse(cachedMemes);
    return parsedMemes;
  } else {
    return await loadMemes();
  }
};

export const useMemeStore = create<MemeStore>((set) => ({
  memes: (loadOrFetchMemes() as unknown as MemeType[]) ?? [],
  setMemes: (memes) => set({ memes }),
  updateOneMeme: (meme) =>
    set((state) => ({
      memes: state.memes.map((m) => (m.id === meme.id ? meme : m)),
    })),
}));
