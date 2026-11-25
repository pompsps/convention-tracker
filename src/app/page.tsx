"use client";

import { useState } from "react";
import PageContainer from "./components/page-container";
import { appPages } from "@/src/lib/pages";
import VerticalNav from "./components/vertical-nav";
import BottomNav from "./components/bottom-nav";
// import Settings from "./components/pages/settings";

export default function Home() {
  const [activeId, setActiveId] = useState(appPages[0].id);
  const current = appPages.find((p) => p.id === activeId) ?? appPages[0];
  const { Component } = current;

  return (
    <div className="flex h-screen lg:h-full relative flex-col overflow-y-auto">
      <div className="lg:flex flex-1 lg:w-full overflow-y-auto h-auto m-4 mb-0  lg:m-0">
        <VerticalNav activePage={activeId} onPageChange={setActiveId} />
        <PageContainer title={current.title}>
          <Component />
        </PageContainer>
      </div>
      <BottomNav activePage={activeId} onPageChange={setActiveId} />
    </div>
  );
}
