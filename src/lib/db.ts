// src/lib/db.ts
import Dexie, { type EntityTable } from "dexie";

export type Item = {
  id: number;
  name: string;
  price: number;
  type: string;
  category: string;
  stock?: number;
  image?: Blob; // the photo itself, stored in the DB
  variations?: Variation[];
};

export type Sale = {
  id: number;
  createdAt: number; // Date.now()
  items: { itemId: number; name: string; price: number; qty: number }[];
  total: number;
  method: "Cash" | "GCash" | "Bank" | "Other";
  voided?: boolean;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
};

export type Convention = {
  id: number;
  createdAt: number; // Date.now()
  name: string;
  location?: string;
  tags: string[];
  expenses: Expense[];
  notes?: string;
  startDate: number;
  endDate: number;
  closedAt?: number;
};

export type Expenses = {
  id: string;
  name: string;
  amount: string;
};

export type Variation = {
  id: string;
  name: string;
  price?: number;
  stock?: number;
};

export const db = new Dexie("convention-sales") as Dexie & {
  items: EntityTable<Item, "id">;
  sales: EntityTable<Sale, "id">;
  conventions: EntityTable<Convention, "id">;
};

export const isLocked = (c: Convention, now = Date.now()) =>
  c.closedAt !== undefined || now > c.endDate;

db.version(1).stores({
  items: "++id, name, category", // only list fields you search/filter by
  sales: "++id, createdAt",
});

db.version(2).stores({
  items: "++id, name, category, type",
  conventions: "++id, name, startDate, *tags",
  sales: "++id, createdAt, conventionId",
});
