import { create } from "zustand";

export const useApp = create((set) => ({
  account: undefined,
  contract: undefined,
  setAccount: (a) => set({ account: a }),
  setContract: (c) => set({ contract: c }),
}));

