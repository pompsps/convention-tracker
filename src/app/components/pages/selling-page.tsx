// src/app/components/sell-page.tsx
"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { db } from "@/src/lib/db";

export default function SellPage({
  conventionId,
  onClose,
}: {
  conventionId: number;
  onClose: () => void;
}) {
  const convention = useLiveQuery(
    async () => (await db.conventions.get(conventionId)) ?? null,
    [conventionId],
  );
  const items = useLiveQuery(() => db.items.toArray()) ?? [];

  if (convention === undefined) return <p className="p-4">Loading...</p>;
  if (convention === null) {
    return (
      <div className="p-4">
        <p>Convention not found.</p>
        <button type="button" onClick={onClose}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div data-no-swipe className="flex h-screen flex-col gap-3 p-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xl">{convention.name}</p>
          <p className="text-xs text-(--text-main)/70">Selling</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close selling screen">
          <XMarkIcon className="size-7" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* your item grid goes here */}
      </div>

      <footer>{/* cart total and checkout button */}</footer>
    </div>
  );
}
