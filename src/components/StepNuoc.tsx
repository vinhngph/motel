import { useStore, GIA_NUOC_PRESETS, NUOC_RATE_CONST } from "../store";
import { formatNumber } from "../lib/format";
import { StepLayout } from "./StepLayout";
import { InputRow } from "./InputRow";
import { NavButtons } from "./NavButtons";

export function StepNuoc() {
  const {
    soNuocCu,
    soNuocMoi,
    giaNuocPreset,
    setSoNuocCu,
    setSoNuocMoi,
    setGiaNuocPreset,
    setStep,
    notify,
  } = useStore();

  function validate() {
    if (soNuocCu !== "") {
      if (Number(soNuocCu) < 0) return notify("nuoc", "Số nước phải ≥ 0!");
    }
    if (soNuocMoi !== "") {
      if (Number(soNuocMoi) < 0) return notify("nuoc", "Số nước phải ≥ 0!");
    }
    if (soNuocCu !== "" && soNuocMoi !== "") {
      if (
        !Number.isInteger(Number(soNuocCu)) ||
        !Number.isInteger(Number(soNuocMoi))
      )
        return notify("nuoc", "Số nước phải là số nguyên!");
      if (Number(soNuocMoi) - Number(soNuocCu) <= 0)
        return notify("nuoc", "Số nước mới phải lớn hơn số cũ!");
    }
    setStep("rac");
  }

  const hasManualInput = soNuocCu !== "" || soNuocMoi !== "";

  return (
    <StepLayout
      step="nuoc"
      badge="💧 NƯỚC"
      badgeColor="bg-blue-500"
      subtitle={
        <span className="text-2xl font-bold text-gray-700">
          {formatNumber(NUOC_RATE_CONST)}{" "}
          <span className="text-lg font-normal text-gray-400">VNĐ / Số</span>
        </span>
      }
      footer={<NavButtons onPrev={() => setStep("dien")} onNext={validate} />}
    >
      {/* Preset buttons */}
      <p className="text-lg text-gray-400 text-center mb-3">
        Chọn nhanh hoặc nhập tay
      </p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {GIA_NUOC_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() =>
              setGiaNuocPreset(giaNuocPreset === preset ? null : preset)
            }
            className={`cursor-pointer h-16 rounded-2xl text-2xl font-bold border-2 transition-colors ${
              giaNuocPreset === preset && !hasManualInput
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-200 active:bg-gray-50"
            }`}
          >
            {formatNumber(preset)}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-base">hoặc nhập chỉ số</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <InputRow
        label="Cũ"
        value={soNuocCu}
        onChange={setSoNuocCu}
        placeholder="Số nước cũ"
      />
      <InputRow
        label="Mới"
        value={soNuocMoi}
        onChange={setSoNuocMoi}
        placeholder="Số nước mới"
      />
    </StepLayout>
  );
}
