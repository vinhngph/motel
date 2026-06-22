import { useStore, GIA_THUE_PRESETS } from "../store";
import { formatNumber } from "../lib/format";
import { StepLayout } from "./StepLayout";
import { NavButtons } from "./NavButtons";

export function StepThue() {
  const { tienThue, setTienThue, setStep, notify, calculate } = useStore();

  function validate() {
    if (!tienThue) return notify("thue", "Chưa chọn giá thuê!");
    calculate();
  }

  return (
    <StepLayout
      step="thue"
      badge="🏠 THUÊ"
      badgeColor="bg-emerald-600"
      subtitle={<span className="text-gray-400 text-lg">VNĐ / Căn</span>}
      footer={
        <NavButtons
          onPrev={() => setStep("rac")}
          onNext={validate}
          nextLabel="Tính tiền"
          nextIcon="check"
          nextColor="bg-emerald-600 active:bg-emerald-700"
        />
      }
    >
      <div className="flex flex-col gap-4 mt-2">
        {GIA_THUE_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setTienThue(tienThue === preset ? null : preset)}
            className={`h-20 rounded-2xl text-3xl font-bold border-2 transition-colors ${
              tienThue === preset
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-700 border-gray-200 active:bg-gray-50"
            }`}
          >
            {formatNumber(preset)}
          </button>
        ))}
      </div>
    </StepLayout>
  );
}
