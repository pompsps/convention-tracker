"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../lib/db";

import { peso } from "@/src/lib/data";
import { useState } from "react";
import ItemImage from "@/src/app/components/item-image";

import { PlusIcon } from "@heroicons/react/16/solid";

export default function Products() {
  const items = useLiveQuery(() => db.items.toArray());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All"); // ← move up here

  const [addItem, setAddItem] = useState(false);

  if (!items) return <p>Loading...</p>; // ← after ALL hooks

  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const visible = items.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      i.name.toLowerCase().includes(query.toLowerCase()),
  );

  //   const productsList = items.map((item) => (
  //     <div
  //       key={item.id}
  //       className="rounded-2xl border border-neutral-200  grid grid-rows-6 gap-2 w-full relative h-full">
  //       <div className="w-full rounded-xl bg-neutral-100 relative row-span-4 items-center justify-center flex">
  //         <div className="absolute bottom-0 right-0 p-2">
  //           {item.stock !== undefined && (
  //             <span
  //               className={`text-xs rounded-full px-2 py-1 border ${
  //                 item.stock <= 5
  //                   ? "bg-red-100 text-red-700"
  //                   : "bg-neutral-100 text-neutral-600"
  //               }`}>
  //               {item.stock} left
  //             </span>
  //           )}
  //         </div>
  //         <ItemImage blob={item.image} alt={item.name} />
  //       </div>
  //       <div className="row-span-2 p-2">
  //         <div>
  //           <p className="font-medium">{item.name}</p>
  //           <p className="text-sm text-neutral-500">{item.category}</p>
  //         </div>
  //         <div>
  //           <p className="font-semibold">{peso(item.price)}</p>
  //         </div>
  //       </div>
  //     </div>
  //   ));

  return (
    <>
      <div className="bg-(--accent) w-full h-fit gap-5 flex flex-col rounded-lg p-10 text-(--text-main)">
        <h1 className="text-2xl font-bold">Inventory</h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:outline-0"
        />

        <div className="flex flex-col gap-5">
          <div className="flex overflow-x-auto gap-2">
            {categories.map((c) => (
              <a
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-lg bg-background p-2 text-(--text-main) ${category === c ? "bg-purple-800 text-white" : "bg-background-30"}`}>
                <h2 className="text-xs ">{c}</h2>
              </a>
            ))}
          </div>
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
              No items found. Add your first item to start selling.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {visible.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-neutral-400 grid grid-rows-6 gap-2 w-full relative h-full overflow-hidden">
                  <div className="w-full rounded-xl bg-neutral-100 relative row-span-4 items-center justify-center flex">
                    <div className="absolute bottom-0 right-0 p-2">
                      {item.stock !== undefined && (
                        <span
                          className={`text-xs rounded-full px-2 py-1 border ${
                            item.stock <= 5
                              ? "bg-red-100 text-red-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}>
                          {item.stock} left
                        </span>
                      )}
                    </div>
                    <ItemImage blob={item.image} alt={item.name} />
                  </div>
                  <div className="row-span-2 p-2">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-neutral-500">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{peso(item.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div onClick={() => setAddItem(!addItem)}>Click me!</div>

          {addItem && <AddItemForm onClose={() => setAddItem(false)} />}
        </div>
      </div>
    </>
  );
}

function AddItemForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await db.items.add({
      name,
      price: Number(price),
      category,
      stock: stock ? Number(stock) : undefined,
      image: file ?? undefined, // a File is a Blob, so it stores directly
    });
    setName("");
    setPrice("");
    setStock("");
    setCategory("");
    setFile(null);
    onClose();
  }

  async function handleDelete(e) {
    e.preventDefault();
    await db.items.delete(items.id);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center md:items-center justify-center backdrop-blur-2xl p-4 flex-col"
      onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="grid grid-rows-12 grid-cols-2 bg-(--accent) p-10 rounded border border-background h-2/3 justify-center items-center overflow-hidden">
        <div className="row-span-6 items-center justify-center flex flex-col col-span-2 gap-2">
          {file && (
            <div className="flex place-items-center aspect-square w-40 rounded-xl bg-neutral-100 object-center">
              <ItemImage blob={file} alt="Preview" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            id="choose-file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <input
          value={name}
          className="col-span-2"
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          value={price}
          className="col-span-1"
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          required
        />
        <input
          value={stock}
          className="col-span-1"
          onChange={(e) => setStock(e.target.value)}
          placeholder="No. of Stocks"
          required
        />
        <select
          value={category}
          className="col-span-2"
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required>
          <option value="Sticker">Sticker</option>
          <option value="Print">Print</option>
          <option value="Pin">Pins</option>
        </select>

        <button type="submit">Add item</button>
      </form>
      <div
        className="w-full justify-center items-center flex text-(--text-main)/70"
        onClick={onClose}>
        Click anywhere outside to close
      </div>
    </div>
  );
}
