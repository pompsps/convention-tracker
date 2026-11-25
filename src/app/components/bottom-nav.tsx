// src/components/vertical-nav.tsx
"use client";

import { useState } from "react";
import {
  Squares2X2Icon,
  BuildingStorefrontIcon,
  SparklesIcon,
  Cog6ToothIcon,
  TableCellsIcon,
  Bars3Icon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { appPages } from "@/src/lib/pages";
const ps = [
  { page: "Dashboard", icon: <Squares2X2Icon /> },
  { page: "Products", icon: <ArchiveBoxIcon /> },
  { page: "Sales", icon: <SparklesIcon /> },
  { page: "Reports", icon: <TableCellsIcon /> },
  { page: "Settings", icon: <Cog6ToothIcon /> },
];

export default function VerticalNav({
  activePage,
  onPageChange,
}: {
  activePage: string;
  onPageChange: (page: string) => void;
}) {
  return (
    <>
      {/* Mobile: floating bottom bar, hidden from md and up */}
      <nav className="lg:hidden bottom-2 z-20 flex rounded-full bg-(--accent) border border-(--accent-secondary) m-4 overflow-hidden p-2 gap-2">
        {appPages.map((p) => (
          <div
            key={p.id}
            className={`flex w-full justify-center items-center p-2 transition-animation ease-in-out duration-300 text-(--text-secondary) rounded-full ${
              activePage === p.id
                ? "bg-(--accent-secondary) text-white "
                : "text-black hover:bg-white/10"
            }`}>
            <button onClick={() => onPageChange(p.id)}>
              <span className="block w-5">{p.icon}</span>
            </button>
            {/* <span className="flex text-xs justify-center items-center">
              {p.title}
            </span> */}
          </div>
        ))}
      </nav>
    </>
  );
}
