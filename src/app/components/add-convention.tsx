"use client";

import { db, type Item, type Convention, type Expense } from "@/src/lib/db";

import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";

import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import React, { useState } from "react";

export default function AddConvention({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [range, setRange] = useState<DateRange | undefined>();
  const [error, setError] = useState("");

  const [hidden, setHidden] = useState(false);

  const addExpense = (description: string, amount: number) =>
    setExpenses((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description, amount },
    ]);

  const removeExpense = (id: string) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));

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
      className="fixed inset-0 z-50 flex items-center md:items-center justify-center backdrop-blur-2xl p-10 flex-col h-full"
      onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="grid grid-cols-2 grid-rows-8 bg-(--accent) p-5 rounded-xl border border-background justify-center items-center gap-2 ">
        <span className="text-2xl">New Convention</span>
        <label className="col-span-2 flex flex-col">
          Convention name
          <input
            value={name}
            className=" focus:outline-none border border-background rounded-lg p-2"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="col-span-2 flex flex-col">
          Location
          <input
            value={location}
            className="col-span-2 focus:outline-none border border-background rounded-lg p-2"
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <div className="col-span-2">
          <label className="flex flex-col">
            Date
            <div className="col-span-2 focus:outline-none border border-background rounded-lg p-2 flex w-full">
              <button
                onClick={() => {
                  setHidden(!hidden);
                }}
              />
              <CalendarDateRangeIcon className="size-10" />
            </div>
          </label>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            className={`${hidden ? "hidden" : "block"}`}
          />
          {!error && <span className="text-red-500">{error}</span>}
        </div>

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

// export async function updateConvention(id: number);
