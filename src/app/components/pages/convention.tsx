"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Convention } from "@/src/lib/db";

import { peso } from "@/src/lib/data";
import { useState, useEffect, useRef } from "react";
import ItemImage from "@/src/app/components/item-image";

import AddConventionForm from "../add-convention";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

export default function Conventions() {
  const conventionCount = useLiveQuery(() => db.conventions.count());
  const conventions = useLiveQuery(() => db.conventions.toArray());

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  const [addConvention, setAddConvention] = useState(false);

  const [collapse, setCollapse] = useState(true);

  // const visible = conventions?.filter((i) => )

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
      </div>

      {addConvention && (
        <AddConventionForm onClose={() => setAddConvention(false)} />
      )}
    </div>
  );
}
