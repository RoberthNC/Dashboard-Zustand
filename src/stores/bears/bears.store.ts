import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Bear {
  id: number;
  name: string;
}

interface BearState {
  blackBears: number;
  polarBears: number;
  pandaBears: number;
  bears: Bear[];
}

interface Actions {
  totalBears: () => number;
  increaseBlackBears: (by: number) => void;
  increasePolarBears: (by: number) => void;
  increasePandaBears: (by: number) => void;
  doNothing: () => void;

  addBear: () => void;
  clearBears: () => void;
}

const bearStore: StateCreator<
  BearState & Actions,
  [["zustand/devtools", never]]
> = (set, get) => ({
  blackBears: 10,
  polarBears: 5,
  pandaBears: 1,
  bears: [],
  totalBears: () => {
    return get().blackBears + get().polarBears + get().pandaBears;
  },
  increaseBlackBears: (by: number) => {
    set(
      (state) => ({ blackBears: state.blackBears + by }),
      false,
      "increaseBlackBears"
    );
  },
  increasePolarBears: (by: number) => {
    set(
      (state) => ({ polarBears: state.polarBears + by }),
      false,
      "increasePolarBears"
    );
  },
  increasePandaBears: (by) => {
    set(
      (state) => ({ pandaBears: state.pandaBears + by }),
      false,
      "increasePandaBears"
    );
  },
  doNothing: () => {
    set((state) => ({ bears: [...state.bears] }), false, "doNothing");
  },
  addBear: () => {
    set(
      (state) => ({
        bears: [
          ...state.bears,
          {
            id: state.bears.length + 1,
            name: `Bear #${state.bears.length + 1}`,
          },
        ],
      }),
      false,
      "addBear"
    );
  },
  clearBears: () => {
    set({ bears: [] }, false, "clearBears");
  },
});

export const useBearStore = create<BearState & Actions>()(
  devtools(persist(bearStore, { name: "bears-store" }))
);
