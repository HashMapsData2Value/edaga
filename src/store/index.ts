import { BroadcastChannel, BroadcastChannels } from "@/data/broadcast-channel";
import { create } from "zustand";

interface ApplicationState {
  broadcastChannel: BroadcastChannel;
  setBroadcastChannel: (channel: BroadcastChannel) => void;
}

export const useApplicationState = create<ApplicationState>((set) => ({
  broadcastChannel: BroadcastChannels[0],
  setBroadcastChannel: (channel: BroadcastChannel) =>
    set({ broadcastChannel: channel }),
}));
