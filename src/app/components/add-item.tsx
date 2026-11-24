"use client";

import { useState } from "react";

import { db, type Item } from "@/src/lib/db";
import ItemImage from "@/src/app/components/item-image";

import { PlusIcon, XCircleIcon } from "@heroicons/react/16/solid";

export default function AddItemForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);
  //   const [isHidden, setIsHidden] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await db.items.add({
      name,
      price: Number(price),
      type,
      category,
      stock: stock ? Number(stock) : undefined,
      image: file ?? undefined, // a File is a Blob, so it stores directly
    });
    setName("");
    setPrice("");
    setStock("");
    setType("");
    setCategory("");
    setFile(null);
    onClose();
  }

  const typeList = [
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
      className="fixed inset-0 z-50 flex items-center md:items-center justify-center backdrop-blur-2xl p-10 flex-col h-full"
      onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="grid grid-rows-6 grid-cols-2 bg-(--accent) p-5 rounded-xl border border-background justify-center items-center gap-2">
        <span className="text-2xl">New Item</span>
        <div className="row-span-4 items-center justify-center flex flex-col col-span-2 gap-2">
          {file && (
            <div className="relative">
              <div className="flex place-items-center justify-center aspect-square size-40 rounded-xl bg-neutral-100 object-cover outline-background p-2">
                <ItemImage blob={file} alt="Preview" />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                  }}
                  aria-label="Remove Photo"
                  className="absolute z-20 -top-3 -right-3 rounded-full bg-red-400 p-2 text-white hover:bg-red-600">
                  <XCircleIcon className="size-5" />
                </button>
              </div>
            </div>
          )}
          <label
            className={`p-2 size-30 place-items-center flex flex-col outline-dashed text-black/40 rounded-2xl ${file ? "hidden" : "blocks"}`}>
            <input
              hidden
              type="file"
              accept="image/*"
              id="choose-file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />{" "}
            <span aria-hidden="true">
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
          value={type}
          className="col-span-2 focus:outline-none border border-background rounded-lg p-2 w-full appearance-none"
          onChange={(e) => setType(e.target.value)}
          required>
          <option value="" disabled hidden>
            Select Type
          </option>
          {typeList.map((t) => (
            <option
              key={t.value}
              value={t.value}
              className="border border-background rounded">
              {t.value}
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
