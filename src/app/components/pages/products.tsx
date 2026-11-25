"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Item } from "@/src/lib/db";

import { peso } from "@/src/lib/data";
import { useState } from "react";
import ItemImage from "@/src/app/components/item-image";

import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/16/solid";

import AddItemForm from "../add-item";
export default function Products() {
  const productCount = useLiveQuery(() => db.items.count());
  const items = useLiveQuery(() => db.items.toArray());
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("");
  const [hasVariant, setHasVariant] = useState(false);

  const [addItem, setAddItem] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  const [collapse, setCollapse] = useState(true);

  if (!items) return <p>Loading...</p>; // ← after ALL hooks

  const types = ["All", ...new Set(items.map((i) => i.type))];
  const categories = ["All", ...new Set(items.map((i) => i.category))];

  const visible = items.filter(
    (i) =>
      (type === "All" || i.type === type) &&
      i.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="gap-2 flex flex-col h-full min-h-0">
      <div className="gap-2 flex flex-col">
        <div className="grid-cols-3 grid">
          <div className="col-span-2">
            <div className="flex flex-col">
              <span className="text-2xl">Your Stash</span>
              <span>{productCount} products total!</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
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

        {addItem && <AddItemForm onClose={() => setAddItem(false)} />}

        <div className="grid grid-cols-3 gap-1 bg-background rounded-2xl p-1 shrink-0">
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

      {/**Filter */}
      <div
        className={`flex flex-col gap-3 bg-(--accent) ${collapse ? "hidden" : "block"}`}>
        <div className="grid grid-cols-6 overflow-x-auto gap-2">
          {types.map((t) => (
            <a
              key={t}
              onClick={() => setType(t)}
              className={`col-span-2 overflow-hidden rounded-full bg-background p-2 text-(--text-main) place-content-center flex  ${type === t ? "bg-purple-800 text-white col-span-2  transition-color duration-300 ease-in-out" : "bg-background-30"}`}>
              <h2 className="text-xs md:text-sm lg:text-lg">{t}</h2>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 z-10 overflow-scroll">
            {visible.map((item) => (
              <a
                key={item.id}
                className="rounded-xl border border-neutral-400 w-full relative h-full overflow-hidden flex flex-col ">
                <div className="size-full rounded-xl bg-neutral-100 relative row-span-4 items-center justify-center flex object-cover">
                  <div className="absolute top-0 left-0">
                    <VariantTag items={item} />
                  </div>
                  <ItemImage blob={item.image} alt={item.name} />
                </div>
                <div className="flex flex-col p-2 w-full justify-between">
                  <div>
                    <div className="row-span-1">
                      <p className="font-bold text-sm">{item.name}</p>
                      <div className="flex w-full text-xs text-neutral-500 gap-1">
                        <span>{item.type}</span>
                        <span>
                          <Category items={item.category} />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex w-full justify-between place-items-center row-span-1">
                      <p className="font-semibold flex w-full">
                        <PriceLabel item={item} />
                      </p>
                    </div>
                    <div className="flex justify-between place-items-center">
                      <span className="text-xs">In Stock</span>
                      {getStock(item) !== undefined && (
                        <span
                          className={`text-sm rounded-lg px-2 py-1 border ${
                            getStock(item)! <= 5
                              ? "bg-red-100 text-red-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}>
                          {getStock(item)} pcs
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VariantTag({ items }: { items: Item }) {
  const variantCount = items.variations?.length ?? 0;
  if (variantCount === 0) return null;

  return (
    <div className="border rounded-lg m-1 p-1 size-full text-sm bg-background flex justify-center">
      <div>{variantCount} Variants</div>
    </div>
  );
}

function Category({ items }: { items: string }) {
  if (items !== "") {
    return <p>- {items}</p>;
  }
  return null;
}

function getStock(item: Item): number | undefined {
  const tracked = (item.variations ?? []).filter((v) => v.stock !== undefined);

  if (tracked.length > 0) {
    return tracked.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  }
  return item.stock; // no variations, or none of them track stock
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

// function ShoppingCart() {
//   return (
//     <div>
//       <ShoppingBagIcon />
//     </div>
//   );
// }

// function StickyHeader() {
//   const [isVisible, setIsVisible] = useState(true);
//   const lastScrollY = useRef(0);
//   const ticking = useRef(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (ticking.current) return;

//       ticking.current = true;
//       requestAnimationFrame(() => {
//         const currentScrollY = window.scrollY;

//         if (currentScrollY < 10) {
//           setIsVisible(true);
//         } else if (currentScrollY > lastScrollY.current) {
//           setIsVisible(false);
//         } else {
//           setIsVisible(true);
//         }

//         lastScrollY.current = currentScrollY;
//         ticking.current = false;
//       });
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return <div></div>;
// }

{
  /* {deleteItem && (
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
)} */
}

{
  /* {itemToEdit && (
  <AddItemForm item={itemToEdit} onClose={() => setItemToEdit(null)} />
)} */
}
