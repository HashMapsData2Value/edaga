import { BroadcastChannel, BroadcastChannels } from "@/config/broadcast.config";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface ApplicationState {
  broadcastChannel: BroadcastChannel;
  setBroadcastChannel: (channel: BroadcastChannel) => void;
  handles: Record<string, string>;
  setHandle: (address: string, handle: string) => void;
  customFees: number[];
  addCustomFee: (fee: number) => void;
  moderation: boolean;
  setModeration: (moderation: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useApplicationState = create<ApplicationState>()(
  persist(
    (set, get) => ({
      broadcastChannel: BroadcastChannels[0],
      setBroadcastChannel: (channel: BroadcastChannel) =>
        set({ broadcastChannel: channel }),
      handles: {},
      setHandle: (address: string, handle: string) =>
        set((state) => ({
          handles: { ...state.handles, [address]: handle },
        })),
      customFees: [],
      addCustomFee: (fee) => {
        const current = get().customFees;
        if (fee <= 5 && !current.includes(fee)) {
          set({ customFees: [...current, fee].sort((a, b) => a - b) });
        }
      },
      moderation: true,
      setModeration: (moderation: boolean) => set({ moderation }),
      theme: "system",
      setTheme: (theme: Theme) => set({ theme }),
    }),
    {
      name: "edaga-application-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
