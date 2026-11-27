"use client";

import { db, type Item, type Convention, type Expense } from "@/src/lib/db";

import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";

import {
  DayPicker,
  type DateRange,
  getDefaultClassNames,
} from "react-day-picker";
import "react-day-picker/style.css";
import React, { useState } from "react";

export default function AddDate({
  range,
  onChange,
  modalClose,
}: {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  modalClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl p-10"
      onClick={modalClose}>
      <div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
        <DayPicker
          mode="range"
          captionLayout="dropdown"
          disabled={{ before: new Date() }}
          startMonth={new Date(2024, 0)}
          endMonth={new Date(2030, 11)}
          min={1}
          max={5}
          selected={range}
          onSelect={onChange}
          className={`[--cell:2.25rem] w-fit `}
          classNames={{
            root: "p-2 border border-background rounded-xl bg-(--accent) text-(--text-main)",
            months: "relative flex flex-col",
            month: "flex flex-col gap-3",

            // header: arrows on the sides, month and year dropdowns in the middle
            nav: "absolute inset-x-0 top-0 flex items-center justify-between",
            button_previous:
              "size-8 inline-flex items-center justify-center rounded-md hover:bg-background",
            button_next:
              "size-8 inline-flex items-center justify-center rounded-md hover:bg-background",
            chevron: "size-4 fill-(--text-main)",
            month_caption: "flex h-8 items-center justify-center px-8",
            dropdowns: "flex items-center gap-1.5 text-sm font-medium",
            dropdown_root:
              "relative rounded-md border border-background px-2 py-1",
            dropdown: "absolute inset-0 opacity-0 cursor-pointer",
            caption_label: "flex items-center gap-1 text-sm",

            // grid
            month_grid: "border-collapse",
            weekdays: "flex",
            weekday:
              "w-(--cell) text-center text-xs font-normal text-(--text-main)/60",
            weeks: "",
            week: "flex mt-1",
            day: "relative size-(--cell) p-0 text-center text-sm",
            day_button:
              "size-full rounded-md hover:bg-background cursor-pointer focus-visible:outline-2",

            // states
            today: "font-bold underline underline-offset-4",
            outside: "text-(--text-main)/30",
            disabled: "opacity-30",
            range_start:
              "bg-(--accent-secondary) rounded-md [&>button]:text-white [&>button]:hover:bg-transparent",
            range_end:
              "bg-(--accent-secondary) rounded-md [&>button]:text-white [&>button]:hover:bg-transparent",

            range_middle:
              "border-y-4 border-white bg-(--accent-secondary)/20 rounded-none",
          }}
        />
        <button
          type="button"
          onClick={modalClose}
          className="rounded-lg bg-(--accent-secondary) p-2 text-white">
          Done
        </button>
      </div>
    </div>
  );
}

// export async function updateConvention(id: number);
