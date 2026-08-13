"use client";

import { Sparkles } from "lucide-react";

export function Toast({ message }: { message: string | null }) {
  return (
    <div
      className={`nd-toast ${message ? "is-visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message && (
        <>
          <Sparkles size={16} className="flex-none text-gold-400" aria-hidden="true" />
          <span>{message}</span>
        </>
      )}
    </div>
  );
}
