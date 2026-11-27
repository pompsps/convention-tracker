// src/components/product-grid.tsx
"use client";

import { useState } from "react";
import { Item, peso } from "../../lib/data";

export default function ProductGrid({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  const types = ["All", ...new Set(items.map((i) => i.type))];
  const visible = items.filter(
    (i) =>
      (type === "All" || i.type === type) &&
      i.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search items..."
        className="w-full rounded-xl border border-neutral-300 px-4 py-3"
      />

      <div className="flex gap-2 overflow-x-auto">
        {types.map((c) => (
          <button
            key={c}
            onClick={() => setType(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm ${
              type === c ? "bg-emerald-700 text-white" : ""
            }`}>
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
          No items found. Add your first item to start selling.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200 p-4 flex flex-col gap-3">
              <div className="aspect-square rounded-xl " />{" "}
              {/* photo goes here */}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-neutral-500">{item.type}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{peso(item.price)}</p>
                {item.stock !== undefined && (
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${
                      item.stock <= 5
                        ? "bg-red-100 text-red-700"
                        : " text-neutral-600"
                    }`}>
                    {item.stock} left
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
