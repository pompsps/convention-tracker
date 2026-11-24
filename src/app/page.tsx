"use client";

import { useState } from "react";
import PageContainer from "./components/page-container";
import { appPages } from "@/src/lib/pages";
import VerticalNav from "./components/vertical-nav";
// import Settings from "./components/pages/settings";

export default function Home() {
  const [activeId, setActiveId] = useState(appPages[0].id);
  const current = appPages.find((p) => p.id === activeId) ?? appPages[0];
  const { Component } = current;

  return (
    <div className="flex h-screen relative flex-col overflow-y-auto gap-2">
      <div className="flex-1 overflow-y-auto h-auto m-4">
        <PageContainer title={current.title}>
          <Component />
        </PageContainer>
      </div>
      <VerticalNav activePage={activeId} onPageChange={setActiveId} />
    </div>
  );
}
