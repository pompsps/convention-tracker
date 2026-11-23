"use client";

import { useState } from "react";
import VerticalNav from "./components/vertical-nav";
import Dashboard from "./components/pages/dashboard";
import Products from "./components/pages/products";
import Sales from "./components/pages/sales";
import Reports from "./components/pages/report";
// import Settings from "./components/pages/settings";

const pages: Record<string, React.ReactNode> = {
  Dashboard: <Dashboard />,
  Products: <Products />,
  Sales: <Sales />,
  Reports: <Reports />,
  // Settings: <Settings />,
};

export default function Home() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="flex h-screen">
      <VerticalNav activePage={activePage} onPageChange={setActivePage} />
      <div className="flex-1 overflow-y-auto p-4">{pages[activePage]}</div>
    </div>
  );
}
