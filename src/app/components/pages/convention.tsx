"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Convention } from "@/src/lib/db";
import { useState, useEffect } from "react";
import AddConventionForm from "../add-convention";
import ViewConvention from "../view-convention";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

import {
  formatRange,
  STATUS_STYLES,
  getStatus,
  StatusBadge,
  ConventionTag,
  getSortGroup,
  LiveBtn,
} from "../assets/getData";

import { useStartSelling } from "@/src/lib/sell-context";

export default function Conventions() {
  const [now, setNow] = useState(() => Date.now());

  const startSelling = useStartSelling();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000); // refresh every minute
    return () => clearInterval(id); // stop the timer when the component unmounts
  }, []);

  const conventionCount = useLiveQuery(() => db.conventions.count());
  const conventions = useLiveQuery(() =>
    db.conventions.orderBy("startDate").reverse().toArray(),
  );

  // const tag = useLiveQuery(async () => db.conventions.get(conId)) ?? null;

  const [query, setQuery] = useState("");
  const [conStatus, setConStatus] = useState("All");

  const [addConvention, setAddConvention] = useState(false);
  const [viewConvention, setViewConvention] = useState(false);
  const [selectedCon, setSelectedCon] = useState<number | null>(null);
  const [editingCon, setEditingCon] = useState<Convention | null>(null);

  // const upcoming = conventions?
  // .filter((item) => new Date(item.startDate).getTime() >= Date.now())
  // .sort((a, b) => new Date(a.date) - new Date(b.date));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const list = (conventions ?? []).toSorted((a, b) => {
    const groupDifference = getSortGroup(a) - getSortGroup(b);
    if (groupDifference !== 0) return groupDifference;

    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const [collapse, setCollapse] = useState(true);

  if (!conventions) return <p>Loading...</p>; // ← after ALL hooks

  const visible = (list ?? []).filter(
    (convention) =>
      conStatus === "All" &&
      convention.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="gap-2 flex flex-col h-full min-h-0">
      <div className="gap-2 flex flex-col">
        <div className="grid-cols-3 grid">
          <div className="col-span-2">
            <div className="flex flex-col">
              <span className="text-2xl">Your Conventions</span>
              <span>{conventionCount} products total!</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <button
              type="button"
              onClick={() => {
                setAddConvention(!addConvention);
                setCollapse(true);
              }}
              className="text-(--accent) rounded-xl p-2 bg-(--accent-secondary) justify-center items-center flex w-full col-span-1 col-start-3">
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-background rounded-2xl p-1 shrink-0">
          <div className="col-span-2 flex place-items-center gap-2 bg-(--accent) rounded-xl border border-neutral-300 p-1">
            <MagnifyingGlassIcon className="size-8" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items..."
              className="focus:outline-none w-full "
            />
          </div>
          <button
            onClick={() => setCollapse(!collapse)}
            className="rounded-xl bg-(--accent) w-full">
            Filters
          </button>
        </div>

        {/* <div
          className={`flex flex-col gap-3 bg-(--accent) ${collapse ? "hidden" : "block"}`}>
          <div className="grid grid-cols-6 overflow-x-auto gap-2">
            {statuses.map((s) => {
              return (
                <div
                  key={s}
                  onClick={() => setConStatus(s)}
                  className={`col-span-2 overflow-hidden rounded-full bg-background p-2 text-(--text-main) place-content-center flex  ${type === s ? "bg-purple-800 text-white col-span-2  transition-color duration-300 ease-in-out" : "bg-background-30"}`}>
                  <h2 className="text-xs md:text-sm lg:text-lg">{s}</h2>
                </div>
              );
            })}
          </div>
          <hr />
        </div> */}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
            No conventions found. Add your first conventions!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 z-10 overflow-scroll">
            {visible.map((con) => {
              const status = getStatus(con, now);

              return (
                <div
                  key={con.id}
                  className={`border-2 border-background rounded-lg w-full p-2 gap-2 grid grid-cols-3 relative ${STATUS_STYLES[status].border}`}
                  onClick={() => {
                    setViewConvention(!viewConvention);
                    setSelectedCon(con.id);
                  }}>
                  <div className="col-span-2">
                    <div>
                      <span className="text-lg">{con.name}</span>
                      <div className="text-xs">{con.location}</div>
                    </div>
                    <div>
                      <div className="text-sm">
                        <div>{formatRange(con.startDate, con.endDate)}</div>
                      </div>
                    </div>
                  </div>
                  <div className={`flex h-full justify-end w-full`}>
                    <StatusBadge status={status} />
                  </div>
                  <div className="col-span-2">
                    <ConventionTag convention={con} />
                  </div>
                  <div>
                    {con.notes?.trim() && (
                      <div className="border rounded">
                        <div className="flex gap-1">
                          <DocumentTextIcon className="w-5" />
                          <span>Notes</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 text-sm">
                    <LiveBtn
                      status={status}
                      con={con}
                      now={now}
                      onClick={() => {
                        startSelling(con.id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedCon !== null && viewConvention && (
          <ViewConvention
            onClose={() => setViewConvention(false)}
            onEdit={(conventions) => {
              setSelectedCon(null);
              setEditingCon(conventions);
            }}
            conventionId={selectedCon}
          />
        )}
      </div>

      {addConvention && (
        <AddConventionForm onClose={() => setAddConvention(false)} />
      )}

      {editingCon && (
        <AddConventionForm
          convention={editingCon}
          onClose={() => setEditingCon(null)}
        />
      )}
    </div>
  );
}
