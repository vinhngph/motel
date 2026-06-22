import type React from "react";
import { useStore, type Step } from "../store";

interface StepLayoutProps {
  step: Step;
  badge: string;
  badgeColor: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const STEP_ORDER: Step[] = ["dien", "nuoc", "rac", "thue", "bill"];

export function StepLayout({
  step,
  badge,
  badgeColor,
  subtitle,
  children,
  footer,
}: StepLayoutProps) {
  const currentStep = useStore((s) => s.step);
  const notification = useStore((s) => s.notifications[step]);

  return (
    <div className="min-h-dvh bg-[#F7F6F2] flex flex-col">
      <div className="flex justify-center gap-2 pt-5 pb-1">
        {STEP_ORDER.map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              s === currentStep
                ? "w-6 bg-gray-700"
                : STEP_ORDER.indexOf(s) < STEP_ORDER.indexOf(currentStep)
                  ? "w-2 bg-gray-400"
                  : "w-2 bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="text-center text-sm text-gray-400 pb-3">
        {STEP_ORDER.indexOf(step) + 1} / {STEP_ORDER.length - 1}
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col mx-4 mb-6 bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="text-center px-6 pt-8 pb-6">
          <span
            className={`inline-block text-white text-3xl font-bold px-6 py-2 rounded-2xl tracking-wider ${badgeColor}`}
          >
            {badge}
          </span>
          {subtitle && (
            <div className="mt-3 text-gray-500 text-xl">{subtitle}</div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 px-5 pb-4">{children}</div>

        {/* Notification */}
        {notification && (
          <div className="mx-5 mb-2">
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-center text-lg font-medium">
              ⚠️ {notification.msg}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 pb-6 pt-2">{footer}</div>
      </div>
    </div>
  );
}
