"use client";

import { useState, useEffect } from "react";
import PageContainer from "./components/page-container";
import { appPages } from "@/src/lib/pages";
import VerticalNav from "./components/vertical-nav";
import BottomNav from "./components/bottom-nav";
import { useSwipe } from "../lib/use-swipe";
import SellPage from "./components/pages/selling-page";
import { SellContext } from "../lib/sell-context";

// import Settings from "./components/pages/settings";

export default function Home() {
  const [sellingId, setSellingId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState(appPages[0].id);
  const current = appPages.find((p) => p.id === activeId) ?? appPages[0];
  const { Component } = current;

  const index = appPages.findIndex((p) => p.id === activeId);

  const swipe = useSwipe({
    onSwipeLeft: () => {
      const next = appPages[index + 1];
      if (next) setActiveId(next.id);
    },
    onSwipeRight: () => {
      const prev = appPages[index - 1];
      if (prev) setActiveId(prev.id);
    },
  });

  useEffect(() => {
    if (sellingId === null) return;
    history.pushState({ selling: true }, "");
    const onPop = () => setSellingId(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [sellingId]);

  if (sellingId !== null) {
    return (
      <SellPage conventionId={sellingId} onClose={() => setSellingId(null)} />
    );
  }

  return (
    <SellContext.Provider value={setSellingId}>
      <div className="flex h-screen lg:h-full relative flex-col overflow-y-auto">
        <div
          {...swipe}
          className="lg:flex flex-1 lg:w-full overflow-y-auto h-auto mx-4 mb-0 lg:m-0">
          <VerticalNav activePage={activeId} onPageChange={setActiveId} />
          <PageContainer title={current.title}>
            <Component />
          </PageContainer>
        </div>
        <BottomNav activePage={activeId} onPageChange={setActiveId} />
      </div>
    </SellContext.Provider>
  );
}
