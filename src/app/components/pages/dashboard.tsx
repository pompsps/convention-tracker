// import { useState } from "react";

// import ProductGrid from "../product-grid";
"use client";
import { peso } from "@/src/lib/data";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Item } from "@/src/lib/db";
export default function Dashboard({ item }: { item: string }) {
  const productCount = useLiveQuery(() => db.items.count());
  const dashCategories = [
    {
      title: "Products",
      value: `${productCount}`,
    },
    {
      title: "Sales",
      value: "No data",
    },
    {
      title: "Overall Stocks",
      value: "No data",
    },
  ];
  return (
    <div className="bg-(--accent) w-full rounded-lg p-10 text-(--text-main) gap-5 h-full flex flex-col">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div>
        <div className="w-full grid grid-cols-2 gap-2">
          {dashCategories.map((i) => (
            <div
              key={i.title}
              className="border border-background rounded p-2 gap-2 flex flex-col h-full">
              <div className="text-xs">{i.title}</div>
              <div className="text-3xl bottom-0">{`${i.value}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
