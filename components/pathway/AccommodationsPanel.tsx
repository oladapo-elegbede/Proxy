// components/pathway/AccommodationsPanel.tsx
"use client";

import { getAccommodationSummaries } from "@/lib/utils/accommodations";

interface AccommodationsPanelProps {
  accommodationIds: string[];
}

export function AccommodationsPanel({ accommodationIds }: AccommodationsPanelProps) {
  const accommodations = getAccommodationSummaries(accommodationIds);

  if (accommodations.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 pb-8">
      <div className="rounded-card border border-neutral-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
            You are entitled to
          </p>
          <p className="text-body font-semibold text-neutral-800 mt-0.5">
            {accommodations.length} accommodation{accommodations.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="divide-y divide-neutral-100">
          {accommodations.map((acc) => (
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