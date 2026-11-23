// src/lib/data.ts

export type Item = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
  image: string;
};

export const items = [
  {
    id: "1",
    name: "Bubbles",
    price: 300,
    category: "Buttons",
    stock: 12,
    image: "/button/bubblepin.png",
  },
  {
    id: "2",
    name: "Enjin",
    price: 250,
    category: "Prints",
    stock: 40,
    image: "/prints/enjin.png",
  },
  // items without an image will show the gray placeholder
];

export const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
