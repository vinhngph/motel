import { useStore } from "../store";
import { parseVNDInput } from "../lib/format";
import { StepLayout } from "./StepLayout";
import { NavButtons } from "./NavButtons";
import { InputRow } from "./InputRow";

export function StepDien() {
  const {
    giaDien,
    soDienCu,
    soDienMoi,
    setGiaDien,
    setSoDienCu,
    setSoDienMoi,
    setStep,
    notify,
  } = useStore();

  function handleGiaDienInput(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (digits === "") {
      setGiaDien("");
      return;
    }
    setGiaDien(Number(digits).toLocaleString("vi-VN"));
  }

  function validate() {
    const gia = parseVNDInput(giaDien);
    if (!gia || gia <= 0) return notify("dien", "Giá điện phải lớn hơn 0!");
    if (soDienCu === "") return notify("dien", "Chưa nhập số điện cũ!");
    if (Number(soDienCu) < 0) return notify("dien", "Số điện phải ≥ 0!");
    if (soDienMoi === "") return notify("dien", "Chưa nhập số điện mới!");
    if (Number(soDienMoi) < 0) return notify("dien", "Số điện phải ≥ 0!");
    if (
      !Number.isInteger(Number(soDienCu)) ||
      !Number.isInteger(Number(soDienMoi))
    )
      return notify("dien", "Số điện phải là số nguyên!");
    if (Number(soDienMoi) - Number(soDienCu) <= 0)
      return notify("dien", "Số điện mới phải lớn hơn số cũ!");
    setStep("nuoc");
  }

  return (
    <StepLayout
      step="dien"
      badge="⚡ ĐIỆN"
      badgeColor="bg-amber-400"
      footer={<NavButtons onNext={validate} />}
    >
      <InputRow
        label="Giá"
        value={giaDien}
        onChange={handleGiaDienInput}
        placeholder="Giá điện"
        unit="VNĐ"
        type="text"
        inputMode="numeric"
      />
      <InputRow
        label="Cũ"
        value={soDienCu}
        onChange={setSoDienCu}
        placeholder="Số điện cũ"
      />
      <InputRow
        label="Mới"
        value={soDienMoi}
        onChange={setSoDienMoi}
        placeholder="Số điện mới"
      />
    </StepLayout>
  );
}
