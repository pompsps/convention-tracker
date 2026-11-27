import { isLocked, type Item, type Convention } from "@/src/lib/db";

import { peso } from "@/src/lib/data";
import { tagColor } from "@/src/lib/tag-color";

import { BanknotesIcon } from "@heroicons/react/24/outline";

export function getStock(item: Item): number | undefined {
  const tracked = (item.variations ?? []).filter((v) => v.stock !== undefined);

  if (tracked.length > 0) {
    return tracked.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  }
  return item.stock; // no variations, or none of them track stock
}

export function PriceLabel({ item }: { item: Item }) {
  const prices = (item.variations ?? [])
    .map((v) => v.price ?? item.price)
    .sort((a, b) => a - b); // lowest first; .map() already made a new array, so this is safe

  if (prices.length === 0) return <span>{peso(item.price)}</span>;

  const min = prices[0];
  const max = prices[prices.length - 1];

  return <span>{min === max ? peso(min) : `${peso(min)} – ${peso(max)}`}</span>;
}

export function Category({ items }: { items: string }) {
  if (items !== "") {
    return <p>- {items}</p>;
  }
  return null;
}

export function VariantTag({ items }: { items: Item }) {
  const variantCount = items.variations?.length ?? 0;
  if (variantCount === 0) return null;

  return (
    <div className="border rounded-lg m-1 p-1 size-full text-sm bg-background flex justify-center">
      <div>{variantCount} Variants</div>
    </div>
  );
}

export function Variants({ items }: { items: Item }) {
  const variantCount = items.variations?.length ?? 0;
  if (variantCount === 0) return null;

  return (
    <div className="flex flex-col w-full gap-2">
      <div>Variants</div>
      <div className="flex flex-col gap-2">
        {items.variations?.map((item) => (
          <div
            key={item.id}
            className="border border-background rounded-lg size-full text-sm bg-background/60 flex justify-center flex-col p-2">
            <div className="flex justify-between items-center">
              <div>
                <div>Name: {item.name}</div>
                <div className="text-xs">
                  <p>Php {item.price}</p>
                </div>
              </div>
              <div>
                <div>
                  {item.stock}pcs <span className="text-xs">in stock</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

export function formatRange(start: number, end: number) {
  const sameDay =
    new Date(start).toDateString() === new Date(end).toDateString();
  return sameDay ? fmt(start) : `${lmt(start)} – ${fmt(end)}`;
}

export type Status = "Ended" | "Ongoing" | "Upcoming";

export const STATUS_STYLES: Record<Status, { badge: string; border: string }> =
  {
    Ended: { badge: "bg-red-400", border: "border-red-400" },
    Ongoing: { badge: "bg-green-400", border: "border-green-400" },
    Upcoming: { badge: "bg-yellow-400", border: "border-yellow-400" },
  };
export function getStatus(con: Convention, now: number): Status {
  if (isLocked(con, now)) return "Ended";
  return now >= con.startDate ? "Ongoing" : "Upcoming";
}

export function GetDays({ start, end }: { start: number; end: number }) {
  const remainingDays = new Date(start).getDay() - new Date(end).getDay();
  return remainingDays;
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`w-20 justify-center flex p-2 h-fit text-xs rounded ${STATUS_STYLES[status].badge}`}>
      {status}
    </span>
  );
}

export function LiveBtn({
  status,
  con,
  now,
  onClick,
}: {
  status: Status;
  con: Convention;
  now: number;
  onClick?: () => void;
}) {
  if (status === "Ongoing") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="flex w-full justify-center p-2 rounded-lg bg-green-400 text-white gap-2">
        <BanknotesIcon className="w-5" /> It&apos;s time...
      </button>
    );
  }

  const label =
    status === "Ended"
      ? "Ended"
      : (() => {
          const d = daysUntil(con.startDate, now);
          return d <= 0
            ? "Starts today!"
            : `${d} ${d === 1 ? "day" : "days"} to go!`;
        })();

  return (
    <button
      type="button"
      disabled
      className="flex w-full justify-center p-2 rounded-lg bg-background text-(--text-main)/70">
      {label}
    </button>
  );
}

export function ConventionTag({ convention }: { convention: Convention }) {
  const tagCount = convention.tags ?? [];
  if (tagCount.length === 0) return null;
  return (
    <div className="col-span-3 flex gap-1 h-full place-items-center">
      {tagCount.map((tag) => {
        const c = tagColor(tag);

        return (
          <div
            key={tag}
            className="text-xs p-1 flex"
            style={{ backgroundColor: c.bg, color: c.text }}>
            {tag}
          </div>
        );
      })}
    </div>
  );
}

export const getSortGroup = (convention: Convention) => {
  const status = getStatus(convention, Date.now());

  if (status === "Ongoing") return 0;
  if (status === "Ended") return 2;
  return 1; // upcoming
};

const startOfDay = (ms: number) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function daysUntil(target: number, now: number) {
  return Math.round((startOfDay(target) - startOfDay(now)) / 86_400_000);
}
