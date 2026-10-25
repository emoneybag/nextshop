"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QTY } from "@/context/CartContext";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  label?: string;
};

export default function QuantityStepper({ value, onChange, min = 1, label = "Quantity" }: Props) {
  const btn =
    "grid size-9 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1"
    >
      <button type="button" className={btn} disabled={value <= min} onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} disabled={value >= MAX_QTY} onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}
