import { createJSONStorage, StateStorage } from "zustand/middleware";

const firebaseUrl =
  "https://zustand-storage-b81fe-default-rtdb.firebaseio.com/zustand";

export const storageApi: StateStorage = {
  getItem: async function (name: string): Promise<string | null> {
    try {
      const data = await fetch(`${firebaseUrl}/${name}.json`).then((res) =>
        res.json()
      );
      console.log("get: ", data);
      return JSON.stringify(data);
    } catch (error) {
      throw error;
    }
  },
  setItem: async function (name: string, value: string): Promise<void> {
    const data = await fetch(`${firebaseUrl}/${name}.json`, {
      method: "PUT",
      body: value,
    }).then((res) => res.json());
    console.count("set: ");
    return;
  },
  removeItem: function (name: string): void {
    sessionStorage.removeItem(name);
  },
};

export const firebaseStorage = createJSONStorage(() => storageApi);
