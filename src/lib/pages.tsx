// src/lib/pages.tsx
import type { ComponentType, ReactNode } from "react";
import {
  Squares2X2Icon,
  ArchiveBoxIcon,
  SparklesIcon,
  TableCellsIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Dashboard from "@/src/app/components/pages/dashboard";
import Products from "@/src/app/components/pages/products";
import Sales from "@/src/app/components/pages/sales";
import Reports from "@/src/app/components/pages/convention";
import Settings from "@/src/app/components/pages/setting";

export type AppPage = {
  id: string;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  Component: ComponentType;
};

export const appPages: AppPage[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "Today at a glance",
    icon: <Squares2X2Icon />,
    Component: Dashboard,
  },
  {
    id: "products",
    title: "Inventory",
    subtitle: "Your entire collection",
    icon: <ArchiveBoxIcon />,
    Component: Products,
  },
  { id: "sales", title: "Sales", icon: <SparklesIcon />, Component: Sales },
  {
    id: "convention",
    title: "Conventions",
    icon: <TableCellsIcon />,
    Component: Reports,
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Cog6ToothIcon />,
    Component: Settings,
  },
];
