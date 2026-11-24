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
const navPages = [
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
      {/* Mobile: floating bottom bar, hidden from md and up */}
      <nav className="md:hidden bottom-2 z-20 flex rounded-full bg-(--accent) border border-(--accent-secondary) m-4 overflow-hidden p-2 gap-2">
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

      {/* Desktop: collapsible sidebar, hidden below md */}
      <div className="hidden md:block relative shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-3 left-3 z-10 size-9 p-1.5 rounded-full text-white hover:bg-white/10 ">
          <Bars3Icon
            className={`${collapsed ? "text-(--text-secondary)" : "text-accent"}`}
          />
        </button>

        <div
          className={`h-screen overflow-hidden base-bg transition-[width] duration-300 ${
            collapsed ? "w-0" : "w-64"
          }`}>
          <div className="w-64 p-5 pt-16 flex flex-col gap-5 text-white">
            {navPages.map((navPage) => (
              <button
                key={navPage.page}
                onClick={() => onPageChange(navPage.page)}
                className={`flex gap-3 items-center rounded-2xl p-3 text-left text-sm transition-colors duration-300 ${
                  activePage === navPage.page
                    ? "bg-white text-black"
                    : "hover:bg-white/10"
                }`}>
                <span className="w-6 shrink-0">{navPage.icon}</span>
                <span>{navPage.page}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
