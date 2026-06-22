import { create } from "zustand";

export type Step = "dien" | "nuoc" | "rac" | "thue" | "bill";

export interface BillRow {
  loai: string;
  cu: number;
  moi: number;
  gia: number;
}

export interface Notification {
  msg: string;
  id: number;
}

interface State {
  step: Step;
  setStep: (step: Step) => void;

  giaDien: string;
  setGiaDien: (v: string) => void;
  soDienCu: string;
  setSoDienCu: (v: string) => void;
  soDienMoi: string;
  setSoDienMoi: (v: string) => void;

  soNuocCu: string;
  setSoNuocCu: (v: string) => void;
  soNuocMoi: string;
  setSoNuocMoi: (v: string) => void;
  giaNuocPreset: number | null;
  setGiaNuocPreset: (v: number | null) => void;

  tienRac: number | null;
  setTienRac: (v: number | null) => void;

  tienThue: number | null;
  setTienThue: (v: number | null) => void;

  billRows: BillRow[];
  billDate: string;

  notifications: Partial<Record<Step, Notification>>;
  notify: (step: Step, msg: string) => void;
  clearNotification: (step: Step) => void;

  // calculate: () => void;
  // reset: () => void;
}

const NUOC_RATE = 3000;

let notificationCounter = 0;

export const useStore = create<State>((set, get) => ({
  step: "dien",

  giaDien: "",
  soDienCu: "",
  soDienMoi: "",

  soNuocCu: "",
  soNuocMoi: "",
  giaNuocPreset: null,

  tienRac: null,

  tienThue: null,

  billRows: [],
  billDate: "",

  notifications: {},

  setStep: (step) => set({ step }),

  setGiaDien: (giaDien) => set({ giaDien }),
  setSoDienCu: (soDienCu) => set({ soDienCu }),
  setSoDienMoi: (soDienMoi) => set({ soDienMoi }),

  setSoNuocCu: (soNuocCu) => set({ soNuocCu }),
  setSoNuocMoi: (soNuocMoi) => set({ soNuocMoi }),
  setGiaNuocPreset: (v) =>
    set({ giaNuocPreset: v, soNuocCu: "", soNuocMoi: "" }),

  setTienRac: (tienRac) => set({ tienRac }),
  setTienThue: (tienThue) => set({ tienThue }),

  notify: (step, msg) => {
    const id = ++notificationCounter;
    set((s) => ({
      notifications: { ...s.notifications, [step]: { msg, id } },
    }));
    setTimeout(() => {
      set((s) => {
        const cur = s.notifications[step];
        if (cur?.id === id) {
          const next = { ...s.notifications };
          delete next[step];
          return { notifications: next };
        }
        return s;
      });
    }, 3000);
  },

  clearNotification: (step) =>
    set((s) => {
      const next = { ...s.notifications };
      delete next[step];
      return { notifications: next };
    }),
}));
