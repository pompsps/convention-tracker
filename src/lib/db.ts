// src/lib/db.ts
import Dexie, { type EntityTable } from "dexie";

export type Item = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock?: number;
  image?: Blob; // the photo itself, stored in the DB
};

export type Sale = {
  id: number;
  createdAt: number; // Date.now()
  items: { itemId: number; name: string; price: number; qty: number }[];
  total: number;
  method: "Cash" | "GCash" | "Card" | "Other";
  voided?: boolean;
};

export const db = new Dexie("convention-sales") as Dexie & {
  items: EntityTable<Item, "id">;
  sales: EntityTable<Sale, "id">;
};

db.version(1).stores({
  items: "++id, name, category", // only list fields you search/filter by
  sales: "++id, createdAt",
});
