import { create } from "zustand";

type WalletStore = {
    refreshTrigger: number;
    triggerRefresh: () => void;
};

export const useWalletStore = create<WalletStore>((set) => ({
    refreshTrigger: 0,
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));