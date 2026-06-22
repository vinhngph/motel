import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface NavButtonsProps {
  onNext: () => void;
  onPrev: () => void;
  nextLabel?: string;
  nextIcon?: "arrow" | "check";
  nextColor?: string;
}

export function NavButtons({
  onNext,
  onPrev,
  nextLabel,
  nextIcon,
  nextColor,
}: NavButtonsProps) {
  return (
    <div className="flex gap-3">
      {onPrev && (
        <button
          onClick={onPrev}
          className="flex-1 flex items-center justify-center gap-2 h-16 rounded-2xl border-2 border-gray-300 text-gray-600 text-xl font-semibold active:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={26} />
          Lại
        </button>
      )}
      <button
        onClick={onNext}
        className={`flex-1 flex items-center justify-center gap-2 h-16 rounded-2xl text-white text-xl font-bold active:opacity-80 transition-opacity ${nextColor}`}
      >
        {nextLabel ?? "Tiếp"}
        {nextIcon === "check" ? (
          <CheckCircle size={26} />
        ) : (
          <ArrowRight size={26} />
        )}
      </button>
    </div>
  );
}
