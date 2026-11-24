"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Item } from "@/src/lib/db";

import { peso } from "@/src/lib/data";
import { useState } from "react";
import ItemImage from "@/src/app/components/item-image";

import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/16/solid";

export default function Products() {
  const productCount = useLiveQuery(() => db.items.count());
  const items = useLiveQuery(() => db.items.toArray());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [addItem, setAddItem] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  const [collapse, setCollapse] = useState(true);

  if (!items) return <p>Loading...</p>; // ← after ALL hooks

  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const visible = items.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      i.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="gap-2 flex flex-col h-full min-h-0">
      <div className="gap-2 flex flex-col">
        <div className="grid-cols-3 grid">
          <div className="col-span-2">
            <div className="flex flex-col">
              <span>Your Stash</span>
              <span>{productCount} products total!</span>
            </div>
          </div>
          <div className="col-span-1 gap-2 bg-(--accent-secondary) shrink-0 p-1 rounded-xl flex-col justify-center items-center">
            <button
              type="button"
              onClick={() => {
                setAddItem(!addItem);
                setCollapse(true);
              }}
              className="text-(--accent) rounded-xl p-2 bg-(--accent-secondary) justify-center items-center flex w-full col-span-1 col-start-3">
              <span>Add Item</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-background rounded-xl p-2 shrink-0">
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

      {addItem && <AddItemForm onClose={() => setAddItem(false)} />}

      <div
        className={`flex flex-col gap-3 bg-(--accent) ${collapse ? "hidden" : "block"}`}>
        <div className="grid grid-cols-6 overflow-x-auto gap-2">
          {categories.map((c) => (
            <a
              key={c}
              onClick={() => setCategory(c)}
              className={`col-span-2 overflow-hidden rounded-full bg-background p-2 text-(--text-main) place-content-center flex  ${category === c ? "bg-purple-800 text-white col-span-2  transition-color duration-300 ease-in-out" : "bg-background-30"}`}>
              <h2 className="text-xs ">{c}</h2>
            </a>
          ))}
        </div>
        <hr />
      </div>

      {/* Cards */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
            No items found. Add your first item to start selling.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 z-10 overflow-scroll">
            {visible.map((item) => (
              <a
                key={item.id}
                className="rounded-xl border border-neutral-400 w-full relative h-full overflow-hidden flex flex-col">
                <div className="size-full rounded-xl bg-neutral-100 relative row-span-4 items-center justify-center flex">
                  <div className="absolute top-0 right-0 p-2">
                    {item.stock !== undefined && (
                      <span
                        className={`text-xs rounded-full px-2 py-1 border ${
                          item.stock <= 5
                            ? "bg-red-100 text-red-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}>
                        {item.stock}pcs
                      </span>
                    )}
                  </div>
                  <ItemImage blob={item.image} alt={item.name} />
                </div>
                <div className="grid-rows-2 p-2 flex flex-col w-full justify-between">
                  <div className="row-span-1">
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-neutral-500">{item.category}</p>
                  </div>
                  <div className="flex w-full justify-between place-items-center row-span-1">
                    <p className="font-semibold">{peso(item.price)}</p>
                    {/* <button
                      onClick={() => setDeleteItem(item)}
                      aria-label={`Delete ${item.name}`}
                      className=" rounded-full bg-red-400 p-2 text-white hover:bg-red-600">
                      <TrashIcon className="size-4" />
                    </button> */}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      {/* {deleteItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setDeleteItem(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-black flex flex-col gap-4">
            <h2 className="text-xl font-bold">Delete item?</h2>
            <p className="text-sm text-neutral-600">
              &quot;{deleteItem.name}&quot; will be removed. This can&apos;t be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteItem(null)}
                className="rounded-xl px-4 py-3 hover:bg-neutral-100">
                Cancel
              </button>
              <button
                onClick={async () => {
                  await db.items.delete(deleteItem.id);
                  setDeleteItem(null);
                }}
                className="rounded-xl bg-red-600 px-4 py-3 text-white font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* {itemToEdit && (
        <AddItemForm item={itemToEdit} onClose={() => setItemToEdit(null)} />
      )} */}
    </div>
  );
}

function AddItemForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isHidden, setIsHidden] = useState(false);

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

  const categoryList = [
    {
      value: "Stickers",
    },
    {
      value: "Prints",
    },
    {
      value: "Photocards",
    },
    {
      value: "Pins",
    },
    {
      value: "Keychain",
    },
    {
      value: "Crochets",
    },
    {
      value: "Coasters",
    },
    {
      value: "Bookmarks",
    },
    {
      value: "3D Prints",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center md:items-center justify-center backdrop-blur-2xl p-4 flex-col h-full"
      onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="grid grid-rows-12 grid-cols-2 bg-(--accent) p-5 rounded-xl border border-background justify-center items-center gap-2">
        <span className="text-2xl">New Item</span>
        <div className="row-span-4 items-center justify-center flex flex-col col-span-2 gap-2">
          {file && (
            <div className="relative">
              <div className="flex place-items-center justify-center aspect-square size-40 rounded-xl bg-neutral-100 object-cover outline-background p-2 outline">
                <ItemImage blob={file} alt="Preview" />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setIsHidden(false);
                  }}
                  aria-label="Remove Photo"
                  className="absolute z-20 -top-3 -right-3 rounded-full bg-red-400 p-2 text-white hover:bg-red-600">
                  <XCircleIcon className="size-5" />
                </button>
              </div>
            </div>
          )}
          <label>
            <input
              hidden
              type="file"
              accept="image/*"
              id="choose-file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              onClick={() => setIsHidden(true)}
            />{" "}
            <span
              aria-hidden="true"
              className={`${isHidden ? "hidden" : "blocks"}`}>
              <PlusIcon />
              Upload file
            </span>
          </label>
        </div>

        <input
          value={name}
          className="col-span-2 focus:outline-none border border-background rounded-lg p-2"
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          value={price}
          className="col-span-1 focus:outline-none border border-background rounded-lg p-2"
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          required
        />
        <input
          value={stock}
          className="col-span-1 focus:outline-none border border-background rounded-lg p-2"
          onChange={(e) => setStock(e.target.value)}
          placeholder="No. of Stocks"
          required
        />
        <select
          value={category}
          className="col-span-2 focus:outline-none border border-background rounded-lg p-2 w-full appearance-none"
          onChange={(e) => setCategory(e.target.value)}
          required>
          <option value="" disabled hidden>
            Select Category
          </option>
          {categoryList.map((c) => (
            <option
              key={c.value}
              value={c.value}
              className="border border-background rounded">
              {c.value}
            </option>
          ))}
        </select>

        <button
          className="flex w-full bg-background col-span-2 items-center justify-center p-2 rounded-lg"
          type="submit">
          Add item
        </button>
      </form>
      <div
        className="w-full justify-center items-center flex text-(--text-main)/70"
        onClick={onClose}>
        Click anywhere outside to close
      </div>
    </div>
  );
}

function ShoppingCart() {
  return (
    <div>
      <ShoppingBagIcon />
    </div>
  );
}
