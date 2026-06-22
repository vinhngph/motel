export function formatVND(num: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}

export function parseVNDInput(raw: string): number {
  return Number(raw.replace(/\D/g, ""));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}
