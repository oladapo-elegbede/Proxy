// components/pathway/AccommodationsPanel.tsx
"use client";

import { getAccommodationsFromBarriers } from "@/lib/utils/accommodations";
import type { AccommodationSummary } from "@/lib/utils/accommodations";

interface AccommodationsPanelProps {
  barrierIds: string[];
}

export function AccommodationsPanel({ barrierIds }: AccommodationsPanelProps) {
  const accommodations = getAccommodationsFromBarriers(barrierIds);

  if (accommodations.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 pb-6">
      <div className="rounded-card border border-primary-100 bg-primary-50 overflow-hidden">
        <div className="px-5 py-4 border-b border-primary-100">
          <p className="text-sm font-medium text-primary-600 uppercase tracking-wide">
            You are entitled to
          </p>
          <p className="text-body font-semibold text-neutral-800 mt-0.5">
            {accommodations.length} academic adjustment{accommodations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="divide-y divide-primary-100">
          {accommodations.map((acc: AccommodationSummary) => (
            <div key={acc.id} className="px-5 py-4">
              <p className="text-body font-semibold text-neutral-800 mb-1">
                {acc.plainLanguageDescription}
              </p>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {acc.whatChangesInPractice}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}