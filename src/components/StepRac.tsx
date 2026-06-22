import { useStore, TIEN_RAC_PRESET } from "../store";
import { formatNumber } from "../lib/format";
import { StepLayout } from "./StepLayout";
import { NavButtons } from "./NavButtons";

export function StepRac() {
  const { tienRac, setTienRac, setStep } = useStore();

  const isActive = tienRac === TIEN_RAC_PRESET;

  return (
    <StepLayout
      step="rac"
      badge="🗑️ RÁC"
      badgeColor="bg-gray-500"
      subtitle={
        <span className="text-gray-400 text-lg">VNĐ / Căn — tuỳ chọn</span>
      }
      footer={
        <NavButtons
          onPrev={() => setStep("nuoc")}
          onNext={() => setStep("thue")}
        />
      }
    >
      <div className="flex flex-col gap-4 mt-4">
        <button
          onClick={() => setTienRac(isActive ? null : TIEN_RAC_PRESET)}
          className={`h-20 rounded-2xl text-3xl font-bold border-2 transition-colors ${
            isActive
              ? "bg-gray-600 text-white border-gray-600"
              : "bg-white text-gray-700 border-gray-200 active:bg-gray-50"
          }`}
        >
          {formatNumber(TIEN_RAC_PRESET)}
        </button>

        {isActive ? (
          <p className="text-center text-gray-400 text-lg">
            ✓ Đã chọn — bấm lại để bỏ
          </p>
        ) : (
          <p className="text-center text-gray-400 text-lg">
            Bấm để chọn, bỏ qua nếu không thu
          </p>
        )}
      </div>
    </StepLayout>
  );
}
