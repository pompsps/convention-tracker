"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Item } from "@/src/lib/db";

import { peso } from "@/src/lib/data";
import { useState } from "react";
import ItemImage from "@/src/app/components/item-image";

import { PlusIcon, TrashIcon } from "@heroicons/react/16/solid";

export default function Products({ item }: { item: string }) {
  const items = useLiveQuery(() => db.items.toArray());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All"); // ← move up here

  const [addItem, setAddItem] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  if (!items) return <p>Loading...</p>; // ← after ALL hooks

  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const visible = items.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      i.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div className="bg-(--accent) w-full h-fit gap-5 flex flex-col rounded-lg p-10 text-(--text-main) relative">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm">Your entire collection</p>
        </div>

        <div className="flex flex-col gap-3 sticky top-0 z-50 bg-(--accent)">
          <div className="grid grid-cols-3 gap-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items..."
              className="col-span-2 w-full rounded-xl border border-neutral-300 px-4 py-3 focus:outline-0"
            />
            <div
              onClick={() => setAddItem(!addItem)}
              className="bg-(--accent-secondary) text-(--accent) text-xs rounded justify-center items-center w-full flex">
              Add item
            </div>

            {addItem && <AddItemForm onClose={() => setAddItem(false)} />}
          </div>
          <hr />
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
          <hr />
        </div>

        <div className="flex flex-col gap-5">
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
              No items found. Add your first item to start selling.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 z-10">
              {visible.map((item) => (
                <a
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
                  <div className="row-span-2 p-2 flex flex-col w-full gap-2 justify-between">
                    <div>
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-500">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex w-full justify-between place-items-center">
                      <p className="font-semibold">{peso(item.price)}</p>
                      <button
                        onClick={() => setDeleteItem(item)}
                        aria-label={`Delete ${item.name}`}
                        className=" rounded-full bg-red-400 p-2 text-white hover:bg-red-600">
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      {deleteItem && (
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
      )}

      {/* {itemToEdit && (
        <AddItemForm item={itemToEdit} onClose={() => setItemToEdit(null)} />
      )} */}
    </>
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
      title: "Stickers",
      value: "Stickers",
    },
    {
      title: "Prints",
      value: "Prints",
    },
    {
      title: "Photocards",
      value: "Photocards",
    },
    {
      title: "Pins",
      value: "Pins",
    },
    {
      title: "Keychain",
      value: "Keychain",
    },
    {
      title: "Crochets",
      value: "Crochets",
    },
    {
      title: "Coasters",
      value: "Coasters",
    },
    {
      title: "Bookmarks",
      value: "Bookmarks",
    },
    {
      title: "3D Prints",
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
        className="grid grid-rows-12 grid-cols-2 bg-(--accent) p-5 rounded border border-background justify-center items-center gap-2">
        <div className="row-span-6 items-center justify-center flex flex-col col-span-2 gap-2">
          {file && (
            <div className="flex place-items-center aspect-square w-40 rounded-xl bg-neutral-100 object-center">
              <ItemImage blob={file} alt="Preview" />
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
          placeholder="Category"
          required>
          <option value="" disabled hidden>
            Select Category
          </option>
          {categoryList.map((c) => (
            <option
              key={c.title}
              value={c.value}
              className="border border-background rounded">
              {c.title}
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
