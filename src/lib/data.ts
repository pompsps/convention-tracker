// src/lib/data.ts

export type Item = {
  id: string;
  name: string;
  price: number;
  type: string;
  category: string;
  stock?: number;
  image: string;
};

export const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
