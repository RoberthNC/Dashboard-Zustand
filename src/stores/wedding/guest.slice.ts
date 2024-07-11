import { StateCreator } from "zustand";

export interface GuestSlice {
  guestCount: number;
  setGuestCount: (value: number) => void;
}

export const createGuestSlice: StateCreator<
  GuestSlice,
  [["zustand/devtools", never]]
> = (set) => ({
  guestCount: 0,
  setGuestCount: (value: number) => {
    if (value < 0) return;
    set({ guestCount: value }, false, "setGuestCount");
  },
});
