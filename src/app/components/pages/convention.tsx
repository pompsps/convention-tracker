"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, isLocked, type Convention } from "@/src/lib/db";

import { useState, useEffect } from "react";

import AddConventionForm from "../add-convention";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Conventions() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000); // refresh every minute
    return () => clearInterval(id); // stop the timer when the component unmounts
  }, []);

  const conventionCount = useLiveQuery(() => db.conventions.count());
  const conventions = useLiveQuery(() =>
    db.conventions.orderBy("startDate").reverse().toArray(),
  );

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  const [addConvention, setAddConvention] = useState(false);

  const [collapse, setCollapse] = useState(true);

  if (!conventions) return <p>Loading...</p>; // ← after ALL hooks

  const visible = conventions.filter(
    (i) => type === "All" && i.name.toLowerCase().includes(query.toLowerCase()),
  );

  const fmt = (ms: number) =>
    new Date(ms).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const lmt = (ms: number) =>
    new Date(ms).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  function formatRange(start: number, end: number) {
    const sameDay =
      new Date(start).toDateString() === new Date(end).toDateString();
    return sameDay ? fmt(start) : `${lmt(start)} – ${fmt(end)}`;
  }

  type Status = "Ended" | "Ongoing" | "Upcoming";

  const STATUS_STYLES: Record<Status, { badge: string; border: string }> = {
    Ended: { badge: "bg-red-400", border: "border-red-400" },
    Ongoing: { badge: "bg-green-400", border: "border-green-400" },
    Upcoming: { badge: "bg-yellow-400", border: "border-yellow-400" },
  };
  function getStatus(con: Convention, now: number): Status {
    if (isLocked(con, now)) return "Ended";
    return now >= con.startDate ? "Ongoing" : "Upcoming";
  }

  function StatusBadge({ status }: { status: Status }) {
    return (
      <span
        className={`w-20 justify-center flex p-2 h-fit text-xs absolute top-0 right-0 ${STATUS_STYLES[status].badge}`}>
        {status}
      </span>
    );
  }

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
        <div className="h-full flex flex-col overflow-auto gap-2">
          {visible.map((con) => {
            const status = getStatus(con, now);
            return (
              <div
                key={con.id}
                className={`border-2 border-background rounded-lg w-full p-2 gap-2 grid grid-cols-3 relative ${STATUS_STYLES[status].border} overflow-auto`}>
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
                  <div className="flex w-fit justify-end absolute  right-0 bottom-0 p-2 gap-2">
                    <div className={`size-6 ${status === "Ended" && "hidden"}`}>
                      <PencilSquareIcon />
                    </div>
                  </div>
                </div>
                {con.notes !== null && (
                  <div className="col-span-2 border p-2 rounded text-sm">
                    {con.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {addConvention && (
        <AddConventionForm onClose={() => setAddConvention(false)} />
      )}
    </div>
  );
}
