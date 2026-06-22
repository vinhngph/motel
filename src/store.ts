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

  // Điện
  giaDien: string;
  soDienCu: string;
  soDienMoi: string;

  // Nước
  soNuocCu: string;
  soNuocMoi: string;
  giaNuocPreset: number | null; // 30000 | 40000

  // Rác
  tienRac: number | null; // 25000 or null

  // Thuê
  tienThue: number | null;

  // Kết quả
  billRows: BillRow[];
  billDate: string;

  // Notification per step
  notifications: Partial<Record<Step, Notification>>;

  // Actions
  setStep: (step: Step) => void;
  setGiaDien: (v: string) => void;
  setSoDienCu: (v: string) => void;
  setSoDienMoi: (v: string) => void;
  setSoNuocCu: (v: string) => void;
  setSoNuocMoi: (v: string) => void;
  setGiaNuocPreset: (v: number | null) => void;
  setTienRac: (v: number | null) => void;
  setTienThue: (v: number | null) => void;
  notify: (step: Step, msg: string) => void;
  clearNotification: (step: Step) => void;
  calculate: () => void;
  reset: () => void;
}

const NUOC_RATE = 3000;

let notifCounter = 0;

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
  setSoNuocCu: (soNuocCu) => set({ soNuocCu, giaNuocPreset: null }),
  setSoNuocMoi: (soNuocMoi) => set({ soNuocMoi, giaNuocPreset: null }),
  setGiaNuocPreset: (v) =>
    set({ giaNuocPreset: v, soNuocCu: "", soNuocMoi: "" }),
  setTienRac: (tienRac) => set({ tienRac }),
  setTienThue: (tienThue) => set({ tienThue }),

  notify: (step, msg) => {
    const id = ++notifCounter;
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

  calculate: () => {
    const s = get();
    const giaDien = Number(s.giaDien.replace(/\D/g, ""));
    const soDienCu = Number(s.soDienCu);
    const soDienMoi = Number(s.soDienMoi);
    const soDien = soDienMoi - soDienCu;
    const tienDien = soDien * giaDien;

    let soNuocCu = Number(s.soNuocCu);
    let soNuocMoi = Number(s.soNuocMoi);
    let soNuoc = soNuocMoi - soNuocCu;

    if (soNuoc === 0 && s.giaNuocPreset) {
      soNuoc = s.giaNuocPreset / NUOC_RATE;
      soNuocMoi = soNuoc;
      soNuocCu = 0;
    }
    const tienNuoc = soNuoc * NUOC_RATE;

    const tienRac = s.tienRac ?? 0;
    const tienThue = s.tienThue ?? 0;

    const rows: BillRow[] = [];
    if (soDien > 0)
      rows.push({ loai: "Điện", cu: soDienCu, moi: soDienMoi, gia: giaDien });
    if (soNuoc > 0)
      rows.push({ loai: "Nước", cu: soNuocCu, moi: soNuocMoi, gia: NUOC_RATE });
    if (tienRac > 0) rows.push({ loai: "Rác", cu: 0, moi: 1, gia: tienRac });
    if (tienThue > 0) rows.push({ loai: "Thuê", cu: 0, moi: 1, gia: tienThue });

    const now = new Date();
    const billDate = `${now.toLocaleTimeString("vi-VN")} - ${now.toLocaleDateString("vi-VN")}`;

    set({ billRows: rows, billDate, step: "bill" });
    void tienDien;
    void tienNuoc;
  },

  reset: () =>
    set({
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
    }),
}));

export const NUOC_RATE_CONST = NUOC_RATE;
export const GIA_NUOC_PRESETS = [30000, 40000];
export const GIA_THUE_PRESETS = [1_400_000, 2_300_000, 2_500_000];
export const TIEN_RAC_PRESET = 25_000;
