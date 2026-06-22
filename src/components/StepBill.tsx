import { Share2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toPng } from "html-to-image";
import { useStore, type Step } from "../store";
import { formatVND, formatNumber } from "../lib/format";

const STEP_MAP: Record<string, Step> = {
  Điện: "dien",
  Nước: "nuoc",
  Rác: "rac",
  Thuê: "thue",
};

export function StepBill() {
  const { billRows, billDate, reset, setStep } = useStore();
  const [sharing, setSharing] = useState(false);

  const total = billRows.reduce((acc, r) => acc + r.gia * (r.moi - r.cu), 0);

  const COLORS: Record<string, string> = {
    Điện: "text-amber-600 bg-amber-50",
    Nước: "text-blue-600 bg-blue-50",
    Rác: "text-gray-600 bg-gray-100",
    Thuê: "text-emerald-700 bg-emerald-50",
  };

  const BORDER_HOVER: Record<string, string> = {
    Điện: "active:border-amber-300 active:bg-amber-50/40",
    Nước: "active:border-blue-300 active:bg-blue-50/40",
    Rác: "active:border-gray-300 active:bg-gray-50",
    Thuê: "active:border-emerald-300 active:bg-emerald-50/40",
  };

  const ICONS: Record<string, string> = {
    Điện: "⚡",
    Nước: "💧",
    Rác: "🗑️",
    Thuê: "🏠",
  };

  async function handleShare() {
    if (sharing) return;
    setSharing(true);
    try {
      const el = document.getElementById("bill-card");
      if (!el) return;

      // html-to-image hỗ trợ oklch và modern CSS đầy đủ
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Convert dataUrl → Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `tien-tro-${Date.now()}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `Hoá đơn ${billDate}`, files: [file] });
      } else {
        // Fallback: download ảnh
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Share error:", err);
      alert("Lỗi khi tạo ảnh bill!");
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#F7F6F2] flex flex-col px-4 py-6 gap-4">
      {/* Bill card */}
      <div
        id="bill-card"
        className="bg-white shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-800 px-6 py-5 text-center">
          <div className="text-white text-3xl font-bold tracking-wide">
            TIỀN TRỌ
          </div>
          <div className="text-gray-400 text-base mt-1">{billDate}</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {billRows.map((row) => {
            const soLuong = row.moi - row.cu;
            const tinh = row.gia * soLuong;
            const isCounter = row.loai === "Điện" || row.loai === "Nước";
            const colorClass = COLORS[row.loai] ?? "text-gray-700 bg-gray-50";
            const hoverClass = BORDER_HOVER[row.loai] ?? "active:bg-gray-50";
            const targetStep = STEP_MAP[row.loai];

            return (
              <button
                key={row.loai}
                onClick={() => setStep(targetStep)}
                className={`w-full text-left px-5 py-4 border-2 border-transparent transition-colors ${hoverClass}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xl font-bold px-3 py-1 rounded-xl ${colorClass}`}
                  >
                    {ICONS[row.loai]} {row.loai}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {formatVND(tinh)}
                    </span>
                  </div>
                </div>
                {isCounter && (
                  <div className="flex gap-4 text-base text-gray-500 pl-1">
                    <span>
                      Cũ:{" "}
                      <b className="text-gray-700">{formatNumber(row.cu)}</b>
                    </span>
                    <span>
                      Mới:{" "}
                      <b className="text-gray-700">
                        {Number.isInteger(row.moi)
                          ? formatNumber(row.moi)
                          : row.moi.toFixed(2)}
                      </b>
                    </span>
                    <span>× {formatNumber(row.gia)} VNĐ</span>
                  </div>
                )}
                {!isCounter && (
                  <div className="text-base text-gray-500 pl-1">
                    {formatNumber(row.gia)} VNĐ / căn
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Total */}
        <div className="bg-gray-800 px-6 py-5 flex justify-between items-center">
          <span className="text-white text-2xl font-semibold">Tổng cộng</span>
          <span className="text-white text-3xl font-bold">
            {formatVND(total)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <button
        onClick={handleShare}
        disabled={sharing}
        className="flex items-center justify-center gap-3 h-16 rounded-2xl bg-blue-600 text-white text-2xl font-bold active:bg-blue-700 transition-colors disabled:opacity-60"
      >
        <Share2 size={26} />
        {sharing ? "Đang xử lý..." : "Gửi Bill"}
      </button>

      <button
        onClick={reset}
        className="flex items-center justify-center gap-3 h-16 rounded-2xl border-2 border-gray-300 bg-white text-gray-700 text-2xl font-bold active:bg-gray-50 transition-colors"
      >
        <RefreshCw size={26} />
        Nhập Mới
      </button>
    </div>
  );
}
