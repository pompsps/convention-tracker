import { useLiveQuery } from "dexie-react-hooks";
import { db, type Convention } from "@/src/lib/db";

import { useState } from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useStartSelling } from "@/src/lib/sell-context";

import {
  formatRange,
  getStatus,
  StatusBadge,
  ConventionTag,
  LiveBtn,
} from "./assets/getData";

import AddConvention from "./add-convention";
import SellPage from "./pages/selling-page";

export default function ViewConvention({
  onClose,
  onEdit,
  conventionId,
}: {
  onClose: () => void;
  onEdit: (convention: Convention) => void;
  conventionId: number;
}) {
  const [now, setNow] = useState(() => Date.now());
  const startSelling = useStartSelling();

  const convention =
    useLiveQuery(async () => db.conventions.get(conventionId)) ?? null;
  const [deleteConvention, setDeleteConvention] = useState<Convention | null>();
  const [editing, setEditing] = useState(false);

  if (convention === undefined) return <p>Loading...</p>;
  if (convention === null) return <p>Item not found</p>;

  if (editing) {
    return (
      <AddConvention
        convention={convention}
        onClose={() => setEditing(false)}
      />
    );
  }

  const status = getStatus(convention, now);
  return (
    <div
      data-no-swipe
      className="fixed inset-0 z-50 flex items-center md:items-center justify-center backdrop-blur-2xl p-10 md:p-15 lg:p-20 flex-col h-screen"
      onClick={onClose}>
      <div
        className="grid grid-rows-12 bg-(--accent) rounded-xl border border-background text-sm overflow-auto w-full p-5 h-full"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex place-items-center w-full justify-between">
          <span>Convention Information</span>
          <div>
            <button
              className="flex w-5 text-red-400  justify-center rounded-lg text-xs place-items-center gap-1"
              type="submit"
              onClick={() => {
                setDeleteConvention(convention);
                console.log("clicked delete!");
              }}>
              <TrashIcon className="w-5" />
            </button>
          </div>

          <span className="w-5" onClick={() => onClose()}>
            <XMarkIcon />
          </span>
        </div>

        <div className="row-span-10 overflow-auto items-center gap-2 ">
          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-between">
              <span className="text-2xl">{convention.name}</span>
              <StatusBadge status={status} />
            </div>
            <div className="flex w-full justify-between">
              <div>Date:</div>
              {formatRange(convention.startDate, convention.endDate)}
            </div>
            <div className="flex w-full justify-between">
              <div>Location:</div>
              {convention.location}
            </div>
            <div className="w-full gap-2">
              <ConventionTag convention={convention} />
            </div>
            <div className="border rounded p-1">
              <span className="w-full flex">Note:</span>
              <hr />
              <span className="p-2">{convention.notes}</span>
            </div>
          </div>
        </div>

        <div className="row-span-2 h-full justify-center flex flex-col">
          <div className="grid grid-cols-4 w-full gap-2 ">
            <div className="col-span-1">
              <button
                className="bg-background justify-center p-2 rounded-lg text-xs place-items-center gap-1 flex w-full"
                type="button"
                onClick={() => {
                  setEditing(true);
                }}>
                <PencilSquareIcon className="w-5" />
              </button>
            </div>
            <div className="col-span-3">
              <LiveBtn
                status={status}
                con={convention}
                now={now}
                onClick={() => {
                  startSelling(convention.id);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {deleteConvention && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => {
            setDeleteConvention(convention);
          }}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-black flex flex-col gap-4">
            <h2 className="text-xl font-bold">Delete item?</h2>
            <p className="text-sm text-neutral-600">
              &quot;{deleteConvention.name}&quot; will be removed. This
              can&apos;t be undone.
            </p>
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setDeleteConvention(null)}
                className="w-full rounded-xl px-4 py-3 bg-background/60 hover:bg-background/40">
                Cancel
              </button>
              <button
                onClick={async () => {
                  onClose();
                  await db.items.delete(deleteConvention.id);
                  setDeleteConvention(null);
                }}
                className="w-full rounded-xl bg-red-600 px-4 py-3 text-white font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
