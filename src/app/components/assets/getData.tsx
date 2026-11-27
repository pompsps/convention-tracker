import { db, type Item } from "@/src/lib/db";

import { peso } from "@/src/lib/data";

function getStock(item: Item): number | undefined {
  const tracked = (item.variations ?? []).filter((v) => v.stock !== undefined);

  if (tracked.length > 0) {
    return tracked.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  }
  return item.stock; // no variations, or none of them track stock
}

function PriceLabel({ item }: { item: Item }) {
  const prices = (item.variations ?? [])
    .map((v) => v.price ?? item.price)
    .sort((a, b) => a - b); // lowest first; .map() already made a new array, so this is safe

  if (prices.length === 0) return <span>{peso(item.price)}</span>;

  const min = prices[0];
  const max = prices[prices.length - 1];

  return <span>{min === max ? peso(min) : `${peso(min)} – ${peso(max)}`}</span>;
}

function Category({ items }: { items: string }) {
  if (items !== "") {
    return <p>- {items}</p>;
  }
  return null;
}
