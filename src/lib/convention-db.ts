import Dexie, { type EntityTable } from "dexie";

export type Convention = {
  id: number;
  createdAt: number; // Date.now()
  name: string;
  items: { itemId: number; name: string; price: number; qty: number }[];
  location: string;
  tags: string;
  expenses: { itemId: number; description: string; amount: number }[];
  notes: string;
};
