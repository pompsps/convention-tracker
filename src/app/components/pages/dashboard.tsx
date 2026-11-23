// import { useState } from "react";

// import ProductGrid from "../product-grid";
import { items, peso } from "@/src/lib/data";

const dashCategories = [
  {
    title: "Products",
    content: <div>{items.length}</div>,
  },
  {
    title: "Sales",
  },
  {
    title: "Overall Stocks",
  },
];
export default function Dashboard() {
  return (
    <div className="bg-(--accent) w-full rounded-lg p-10 text-(--text-main) gap-5 h-full flex flex-col">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div>
        <div className="w-full grid grid-cols-2 gap-2">
          {dashCategories.map((item) => (
            <div
              key={item.title}
              className="border border-background rounded p-2 gap-2 flex flex-col h-full">
              <div className="text-xs">{item.title}</div>
              <div className="text-3xl bottom-0">{item.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
