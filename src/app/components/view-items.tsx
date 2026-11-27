"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Item } from "@/src/lib/db";

import { peso } from "@/src/lib/data";
import { useState } from "react";
import ItemImage from "@/src/app/components/item-image";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/16/solid";

import AddItemForm from "./add-item";

// import EditItemForm from "./edit-item";
export default function ViewItem({
  onClose,
  onEdit,
  itemId,
}: {
  onClose: () => void;
  onEdit: (item: Item) => void;
  itemId: number;
}) {
  const item = useLiveQuery(async () => db.items.get(itemId)) ?? null;
  const [deleteItem, setDeleteItem] = useState<Item | null>();
  const [editing, setEditing] = useState(false);

  if (item === undefined) return <p>Loading...</p>;
  if (item === null) return <p>Item not found</p>;

  if (editing) {
    return <AddItemForm item={item} onClose={() => setEditing(false)} />;
  }
  return (
    <div
      data-no-swipe
      className="fixed inset-0 z-50 flex items-center md:items-center justify-center backdrop-blur-2xl p-10 md:p-15 lg:p-20 flex-col h-screen"
      onClick={onClose}>
      <div
        className="grid grid-rows-12 bg-(--accent) rounded-xl border border-background text-sm overflow-auto w-full p-5 h-full"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex place-items-center w-full justify-between">
          <p>Product Information</p>

          <span className="w-5">
            {deleteItem && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                onClick={() => {
                  setDeleteItem(item);
                }}>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-sm rounded-2xl bg-white p-6 text-black flex flex-col gap-4">
                  <h2 className="text-xl font-bold">Delete item?</h2>
                  <p className="text-sm text-neutral-600">
                    &quot;{deleteItem.name}&quot; will be removed. This
                    can&apos;t be undone.
                  </p>
                  <div className="flex justify-between gap-3">
                    <button
                      onClick={() => setDeleteItem(null)}
                      className="w-full rounded-xl px-4 py-3 bg-background/60 hover:bg-background/40">
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        onClose();
                        await db.items.delete(deleteItem.id);
                        setDeleteItem(null);
                      }}
                      className="w-full rounded-xl bg-red-600 px-4 py-3 text-white font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </span>
          <span className="w-5" onClick={() => onClose()}>
            <XMarkIcon />
          </span>
        </div>
        {/** scrollable */}
        <div className="row-span-10 overflow-auto items-center rounded-xl ">
          <div className="overflow-scroll gap-2 flex-col flex ">
            <div className="flex flex-col justify-center items-center border border-background rounded-2xl bg-background aspect-square">
              <div>
                <ItemImage blob={item.image} alt={item.name} />
              </div>
              <div className="text-2xl">{item.name}</div>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6 gap-2 flex flex-col items-center">
                  <div>{item.type}</div>
                </div>
                <div className="col-span-6 gap-2 flex flex-col items-center">
                  <span>
                    {item.category !== "" ? (
                      <div>{item.category}</div>
                    ) : (
                      <div>No category</div>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-12 w-full gap-2">
                <div className="col-span-6 text-xl">In Stock</div>
                <div className="col-span-6 items-end flex-col flex">
                  {getStock(item) !== undefined && (
                    <span
                      className={`text-lg ${
                        getStock(item)! <= 5
                          ? "bg-red-100 text-red-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}>
                      {getStock(item)} pcs
                    </span>
                  )}
                </div>
                <hr className="col-span-full" />
                <div className="col-span-full flex justify-between">
                  <span>Price</span>
                  <div>
                    <PriceLabel item={item} />
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <Variants items={item} />
              </div>
            </div>
          </div>
        </div>

        <div className="row-span-2 h-full justify-center  flex flex-col">
          <div className="grid grid-cols-2 w-full gap-2 ">
            <div>
              <button
                className="flex w-full bg-background justify-center p-2 rounded-lg text-xs place-items-center gap-1 "
                type="button"
                onClick={() => {
                  setEditing(true);
                }}>
                <PencilSquareIcon className="w-5" />
                Edit Product
              </button>
            </div>
            <div>
              <button
                className="flex w-full bg-red-400 text-white justify-center p-2 rounded-lg text-xs place-items-center gap-1"
                type="submit"
                onClick={() => {
                  setDeleteItem(item);
                  console.log("clicked delete!");
                }}>
                <TrashIcon className="w-5" />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceLabel({ item }: { item: Item }) {
  const prices = (item.variations ?? [])
    .map((v) => v.price ?? item.price)
    .sort((a, b) => a - b); // lowest first; .map() already made a new array, so this is safe

  if (prices.length === 0) return <span>{peso(item.price)}</span>;

  const min = prices[0];
  const max = prices[prices.length - 1];

  return <span>{min === max ? peso(min) : `${peso(min)} – ${peso(max)}`}</span>;
}

function getStock(item: Item): number | undefined {
  const tracked = (item.variations ?? []).filter((v) => v.stock !== undefined);

  if (tracked.length > 0) {
    return tracked.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  }
  return item.stock; // no variations, or none of them track stock
}

function Variants({ items }: { items: Item }) {
  const variantCount = items.variations?.length ?? 0;
  if (variantCount === 0) return null;

  return (
    <div className="flex flex-col w-full gap-2">
      <div>Variants</div>
      <div className="flex flex-col gap-2">
        {items.variations?.map((item) => (
          <div
            key={item.id}
            className="border border-background rounded-lg size-full text-sm bg-background/60 flex justify-center flex-col p-2">
            <div className="flex justify-between items-center">
              <div>
                <div>Name: {item.name}</div>
                <div className="text-xs">
                  <p>Php {item.price}</p>
                </div>
              </div>
              <div>
                <div>
                  {item.stock}pcs <span className="text-xs">in stock</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
