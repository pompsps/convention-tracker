"use client";

import CreatableSelect from "react-select/creatable";

import { useState } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Item, type Variation } from "@/src/lib/db";
import ItemImage from "@/src/app/components/item-image";

import { CameraIcon, XCircleIcon } from "@heroicons/react/16/solid";

export default function AddItemForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hasVariations, setHasVariations] = useState(false);

  type VariationDraft = {
    id: string;
    name: string;
    price: string;
    stock: string;
  };
  const [variations, setVariations] = useState<VariationDraft[]>([]);

  const addVariation = () =>
    setVariations((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", price: "", stock: "" },
    ]);

  const updateVariation = (
    id: string,
    field: "name" | "price" | "stock",
    value: string,
  ) =>
    setVariations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );

  const removeVariation = (id: string) => {
    const next = variations.filter((v) => v.id !== id);
    setVariations(next);
    if (next.length === 0) setHasVariations(false);
  };

  const items = useLiveQuery(() => db.items.toArray()) ?? [];

  const typeOptions = [...new Set(items.map((i) => i.type).filter(Boolean))]
    .sort()
    .map((t) => ({ value: t, label: t }));

  const categoryOptions = [
    ...new Set(items.map((i) => i.category).filter(Boolean)),
  ]
    .sort()
    .map((c) => ({ value: c, label: c }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanVariations: Variation[] = hasVariations
      ? variations
          .filter((v) => v.name.trim())
          .map((v) => ({
            id: v.id,
            name: v.name.trim(),
            price: v.price ? Number(v.price) : undefined, // blank = use the item's base price
            stock: v.stock ? Number(v.stock) : undefined,
          }))
      : [];

    await db.items.add({
      name,
      price: Number(price),
      type,
      category,
      stock: stock ? Number(stock) : undefined,
      image: file ?? undefined, // a File is a Blob, so it stores directly
      variations: cleanVariations,
    });
    setName("");
    setPrice("");
    setStock("");
    setType("");
    setCategory("");
    setFile(null);
    setVariations([]);
    setHasVariations(false);
    onClose();
  }

  return (
    <div
      data-no-swipe
      className="fixed inset-0 z-50 flex items-center md:items-center justify-center backdrop-blur-2xl p-10 flex-col h-screen"
      onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col bg-(--accent) p-5 rounded-xl border border-background  gap-2 text-sm overflow-auto h-screen">
        <span className="text-3xl">New Item</span>

        <div className="items-center justify-center flex flex-col gap-2 min-h-50">
          {file && (
            <div className="relative">
              <div className="flex place-items-center justify-center aspect-square size-40 rounded-xl bg-neutral-100 object-cover outline-background p-2">
                <ItemImage blob={file} alt="Preview" />
              </div>
              <div className="flex justify-center  w-full">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                  }}
                  aria-label="Remove Photo"
                  className=" flex gap-2 justify-center items-center rounded-2xl bg-red-400 p-2 text-white hover:bg-red-600 relative">
                  <XCircleIcon className="size-5" /> <span>Clear Image</span>
                </button>
              </div>
            </div>
          )}
          <label
            className={`size-20 justify-center items-center flex flex-col outline-dashed text-black/40 rounded-xl ${file ? "hidden" : "blocks"}`}>
            <input
              hidden
              type="file"
              accept="image/*"
              id="choose-file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />{" "}
            <CameraIcon className="size-10" />
            <span className="text-xs">Upload file</span>
          </label>
        </div>
        <div className="grid  grid-cols-2 gap-2">
          <label className="col-span-2 flex flex-col">
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" focus:outline-none border border-background focus:border-(--text-secondary) rounded-lg p-2 transition-all ease-in-out delay-50"
              required
            />
          </label>
          <div
            className={`grid grid-cols-2 col-span-2 gap-2 ${!hasVariations ? "block" : "hidden"}`}>
            <label className={`col-span-1 flex flex-col `}>
              <span>Price</span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`focus:outline-none border border-background focus:border-(--text-secondary) rounded-lg p-2 transition-all ease-in-out delay-50 ${hasVariations ? "" : "required"} `}
              />
            </label>
            <label className="col-span-1 flex flex-col">
              <span>Stock</span>
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`focus:outline-none border border-background focus:border-(--text-secondary) rounded-lg p-2 transition-all ease-in-out delay-50 ${hasVariations && variations.length > 0 ? "" : "required"}`}
              />
            </label>
          </div>
          <label className="col-span-2 flex flex-col">
            <span>Category</span>

            <CreatableSelect
              isClearable
              options={categoryOptions}
              className="border-background"
              value={category ? { value: category, label: category } : null}
              onChange={(opt) => setCategory(opt?.value ?? "")}
              placeholder="i.e. Pokemon, Genshin Impact"
              instanceId="item-type"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "transparent",
                  borderColor: state.isFocused
                    ? "var(--text-secondary)"
                    : "var(--background)",
                  borderRadius: "0.5rem",
                  boxShadow: "none",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "var(--background)"
                    : "transparent",
                  color: "inherit",
                }),
                menu: (base) => ({ ...base, backgroundColor: "var(--accent)" }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "var(--background)",
                }),
              }}
            />
          </label>

          <label className="col-span-2 flex flex-col">
            <span>Type</span>

            <CreatableSelect
              isClearable
              options={typeOptions}
              value={type ? { value: type, label: type } : null}
              onChange={(opt) => setType(opt?.value ?? "")}
              placeholder="i.e. Sticker"
              instanceId="item-type"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "transparent",
                  borderColor: state.isFocused
                    ? "var(--text-secondary)"
                    : "var(--background)",
                  borderRadius: "0.5rem",
                  boxShadow: "none",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "var(--background)"
                    : "transparent",
                  color: "inherit",
                }),
                menu: (base) => ({ ...base, backgroundColor: "var(--accent)" }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "var(--background)",
                }),
              }}
              required
            />
          </label>
        </div>
        <label className="col-span-2 flex gap-2">
          {" "}
          Has other variations?
          <div className="relative inline-block w-11 h-5">
            <input
              id="switch-component-custom"
              type="checkbox"
              className="peer appearance-none w-11 h-full bg-slate-100 border border-(--text-main)/40 rounded-full checked:bg-(--accent-border) checked:border-slate-800 cursor-pointer transition-colors duration-300"
              checked={hasVariations}
              onChange={(e) => {
                const on = e.target.checked;
                setHasVariations(on);
                if (on && variations.length === 0) addVariation();
              }}
            />
            <label
              htmlFor="switch-component-custom"
              className="absolute top-0 left-0 size-5 bg-background rounded-full border border-(--accent-border)/30 shadow transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"></label>
          </div>{" "}
        </label>

        {hasVariations && (
          <div className="flex flex-col gap-2">
            {variations.map((v) => (
              <div
                key={v.id}
                className="grid grid-cols-2 gap-2 items-center border border-background p-2 rounded">
                <div className="col-span-2 flex flex-col">
                  <span>Name</span>
                  <div className="flex w-full gap-2">
                    <input
                      value={v.name}
                      onChange={(e) =>
                        updateVariation(v.id, "name", e.target.value)
                      }
                      placeholder=" e.g. Holographic"
                      className="focus:outline-none border border-background focus:border-(--text-secondary) rounded-lg p-2 w-full"
                      required
                    />
                    <button
                      className="flex justify-center items-center w-fit"
                      type="button"
                      onClick={() => removeVariation(v.id)}
                      aria-label="Remove variation">
                      <XCircleIcon className="size-6 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="col-span-1 flex flex-col">
                  <span>Price</span>
                  <input
                    value={v.price}
                    onChange={(e) =>
                      updateVariation(v.id, "price", e.target.value)
                    }
                    inputMode="decimal"
                    className="focus:outline-none border border-background focus:border-(--text-secondary) rounded-lg p-2"
                  />
                </div>
                <div className="col-span-1 flex flex-col">
                  <span>Stock</span>
                  <input
                    value={v.stock}
                    onChange={(e) =>
                      updateVariation(v.id, "stock", e.target.value)
                    }
                    inputMode="numeric"
                    className="focus:outline-none border border-background focus:border-(--text-secondary) rounded-lg p-2"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariation}
              className="rounded-lg border border-dashed border-background p-2">
              + Add variation
            </button>
          </div>
        )}
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
