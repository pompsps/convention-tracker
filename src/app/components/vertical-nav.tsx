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

const p = [
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop: collapsible sidebar, hidden below md */}
      <div className="hidden lg:block shrink-0 bg-background">
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`absolute top-5 left-6 z-10 size-10 p-1.5 rounded-full text-white hover:bg-white/10 `}>
          <Bars3Icon
            className={` ${collapsed ? "text-(--text-secondary)" : "text-accent"}`}
          />
        </button>

        <div
          className={`h-screen overflow-hidden transition-[width] duration-300 ${
            collapsed ? "w-22" : "w-64"
          }`}>
          <div className="m-5 pt-16 flex flex-col gap-5 text-white">
            {appPages.map((p) => (
              <button
                key={p.id}
                onClick={() => onPageChange(p.id)}
                className={`flex w-full items-center rounded-2xl p-3 transition-colors duration-300 ${collapsed ? "gap-0" : "gap-3"} ${
                  activePage === p.id
                    ? "bg-(--accent-secondary) text-white "
                    : "text-black hover:bg-white/10"
                }`}>
                <span className="size-6 shrink-0">{p.icon}</span>
                <span className={`transition-[width] duration-300`}>
                  {collapsed ? <span></span> : <span>{p.title}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
