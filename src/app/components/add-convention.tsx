"use client";

import { db, type Item, type Convention, type Expense } from "@/src/lib/db";

import CreatableSelect from "react-select/creatable";
import {
  CalendarDateRangeIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import AddDate from "./add-date";

import {
  DayPicker,
  type DateRange,
  getDefaultClassNames,
} from "react-day-picker";
import "react-day-picker/style.css";
import React, { useState } from "react";

export default function AddConvention({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [error, setError] = useState("");
  const [hasExpenses, setHasExpenses] = useState(false);

  const defaults = getDefaultClassNames();

  const [hidden, setHidden] = useState(true);
  const [addDate, setAddDate] = useState(false);

  type ExpensesDraft = {
    id: string;
    name: string;
    amount: string;
  };
  const [expenses, setExpenses] = useState<ExpensesDraft[]>([]);

  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const dateLabel = range?.from
    ? `${fmt(range.from)}${range.to ? ` – ${fmt(range.to)}` : ""}`
    : "Pick dates";

  const addExpenses = () =>
    setExpenses((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", amount: "" },
    ]);

  const updateExpenses = (
    id: string,
    field: "name" | "amount",
    value: string,
  ) =>
    setExpenses((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)),
    );

  const removeExpenses = (id: string) => {
    const next = expenses.filter((ex) => ex.id !== id);
    setExpenses(next);
    if (next.length === 0) setHasExpenses(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return setError("Please enter a name.");
    if (!range?.from) return setError("Please pick a date range.");

    const start = new Date(range.from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(range.to ?? range.from);
    end.setHours(23, 59, 59, 999);

    setError("");

    console.log({ name });
    console.log(start, end);

    // await db.conventions.add({
    //   createdAt: Date.now(),
    //   name,
    //   location,
    //   tags,
    //   expenses,
    //   notes,
    //   startDate: start.getTime(),
    //   endDate: end.getTime(),
    // });

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center md:items-center justify-center backdrop-blur-2xl p-10 flex-col h-full "
      onClick={onClose}>
      <div className="flex flex-col bg-(--accent) rounded-xl border border-background  gap-2 text-sm overflow-auto h-screen justify-between w-full">
        <form
          data-no-swipe
          className="flex flex-col gap-2 p-5 relative h-full"
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}>
          <span className="text-3xl">New Item</span>

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
          </div>

          <div className="grid  grid-cols-2 gap-2">
            <label className="col-span-2 flex flex-col">
              <span>Location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className=" focus:outline-none border border-background focus:border-(--text-secondary) rounded-lg p-2 transition-all ease-in-out delay-50"
                required
              />
            </label>
          </div>

          <div className="col-span-2">
            <label className="flex flex-col">
              Date
              <div className="col-span-2 focus:outline-none border border-background rounded-lg p-2 flex w-full">
                <button
                  onClick={() => {
                    setAddDate(!addDate);
                  }}
                />
                <CalendarDateRangeIcon className="size-5" />
                <span>{dateLabel}</span>
              </div>
            </label>

            {addDate && (
              <AddDate
                modalClose={() => setAddDate(false)}
                range={range}
                onChange={setRange}
              />
            )}

            {!error && <span className="text-red-500">{error}</span>}
          </div>

          {hasExpenses && (
            <div className="flex flex-col gap-2">
              <div>
                <span>Expenses (optional)</span>
              </div>
              {expenses.map((ex) => (
                <div
                  key={ex.id}
                  className=" items-center border border-background p-2 rounded">
                  <div className="col-span-2 w-full flex">
                    <div className="grid grid-cols-8 gap-2 w-full">
                      <div className="col-span-4 flex flex-col">
                        <span>Description</span>
                      </div>

                      <div className="col-span-3 flex flex-col">
                        <span>Price</span>
                      </div>
                      <div className="col-span-4 flex flex-col">
                        <input
                          value={ex.name}
                          onChange={(e) =>
                            updateExpenses(ex.id, "name", e.target.value)
                          }
                          placeholder="e.g. Food, Parking"
                          className="focus:outline-none border border-background focus:border-(--text-secondary) rounded-lg p-2"
                          required
                        />
                      </div>

                      <div className="col-span-3 flex flex-col">
                        <input
                          value={ex.amount}
                          onChange={(e) =>
                            updateExpenses(ex.id, "amount", e.target.value)
                          }
                          inputMode="decimal"
                          className="focus:outline-none border border-background focus:border-(--text-secondary) rounded-lg p-2"
                        />
                      </div>
                      <button
                        className="flex justify-center items-center w-full"
                        type="button"
                        onClick={() => removeExpenses(ex.id)}
                        aria-label="Remove Expenses">
                        <XCircleIcon className="size-6 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <label className={`col-span-2 flex justify-between`}>
            {" "}
            <div>
              {!hasExpenses ? (
                <a
                  onClick={() => {
                    setHasExpenses(true);
                    if (expenses.length === 0) addExpenses();
                  }}>
                  + Add Expenses
                </a>
              ) : (
                <div className="flex w-full gap-2">
                  <a
                    type="button"
                    onClick={addExpenses}
                    className={`rounded-lg border border-dashed border-background p-2 w-full $`}>
                    + Add Another Expenses
                  </a>
                </div>
              )}
            </div>
          </label>

          <button
            className="flex w-full bg-background justify-center p-2 rounded-lg $"
            type="submit">
            Add item
          </button>
        </form>
      </div>
      <div className="w-full justify-center items-center flex text-(--text-main)/70">
        Click anywhere outside to close
      </div>
    </div>
  );
}

// export async function updateConvention(id: number);
