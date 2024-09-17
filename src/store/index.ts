import { BroadcastChannel, BroadcastChannels } from "@/config/broadcast.config";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface ApplicationState {
  broadcastChannel: BroadcastChannel;
  setBroadcastChannel: (channel: BroadcastChannel) => void;
  handles: Record<string, string>;
  setHandle: (address: string, handle: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  moderation: boolean;
  setModeration: (moderation: boolean) => void;
}

export const useApplicationState = create<ApplicationState>()(
  persist(
    (set) => ({
      broadcastChannel: BroadcastChannels[0],
      setBroadcastChannel: (channel: BroadcastChannel) =>
        set({ broadcastChannel: channel }),
      handles: {},
      setHandle: (address: string, handle: string) =>
        set((state) => ({
          handles: { ...state.handles, [address]: handle },
        })),
      theme: "system",
      setTheme: (theme: Theme) => set({ theme }),
      moderation: true,
      setModeration: (moderation: boolean) => set({ moderation }),
    }),
    {
      name: "edaga-application-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
