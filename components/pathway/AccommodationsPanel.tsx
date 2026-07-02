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
    <section
      aria-labelledby="accommodations-heading"
      className="max-w-2xl mx-auto px-6 pb-6"
    >
      <div className="rounded-card border border-primary-100 bg-primary-50 overflow-hidden">
        <div className="px-5 py-4 border-b border-primary-100">
          <p
            className="text-sm font-medium text-primary-600 uppercase tracking-wide"
            aria-hidden="true"
          >
            You are entitled to
          </p>
          <h2
            id="accommodations-heading"
            className="text-body font-semibold text-neutral-800 mt-0.5"
          >
            {accommodations.length} academic adjustment
            {accommodations.length !== 1 ? "s" : ""}
          </h2>
        </div>

        <ul
          className="divide-y divide-primary-100 list-none"
          aria-label="Your academic adjustments"
        >
          {accommodations.map((acc: AccommodationSummary) => (
            <li key={acc.id} className="px-5 py-4">
              <h3 className="text-body font-semibold text-neutral-800 mb-1">
                {acc.plainLanguageDescription}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {acc.whatChangesInPractice}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}