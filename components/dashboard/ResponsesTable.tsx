"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Download, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ParsedResponse } from "@/lib/parseResponses";
import { downloadCSV } from "@/lib/parseResponses";
import { cn } from "@/lib/utils";

interface ResponsesTableProps {
  data: ParsedResponse[];
  delay?: number;
}

const LIKERT_COLOR: Record<number, string> = {
  1: "bg-red-100 text-red-700",
  2: "bg-orange-100 text-orange-700",
  3: "bg-amber-100 text-amber-700",
  4: "bg-lime-100 text-lime-700",
  5: "bg-green-100 text-green-700",
};

const LIKERT_LABEL: Record<number, string> = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree",
};

function LikertBadge({ value }: { value: number }) {
  if (!value) return <span className="text-coffee-300">—</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        LIKERT_COLOR[value]
      )}
    >
      {value} · {LIKERT_LABEL[value]}
    </span>
  );
}

function MultiChips({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-coffee-300">—</span>;
  return (
    <div className="flex flex-wrap gap-1 max-w-[220px]">
      {items.map((item) => (
        <span
          key={item}
          className="inline-block px-2 py-0.5 rounded-full bg-coffee-50 border border-coffee-100 text-xs text-coffee-700 whitespace-nowrap"
        >
          {item.split(" /")[0].split(" (")[0].trim()}
        </span>
      ))}
    </div>
  );
}

const ALL_SOURCES = [
  "Coffee",
  "Tea",
  "Energy drinks",
  "Soft drinks / Soda",
  "Pre-workout supplements",
  "Caffeine pills",
  "Other",
];

export function ResponsesTable({ data, delay = 0 }: ResponsesTableProps) {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((r) => {
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q);
      const matchesSource =
        sourceFilter === "All" || r.source === sourceFilter;
      return matchesSearch && matchesSource;
    });
  }, [data, search, sourceFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl border border-coffee-100 shadow-sm overflow-hidden"
    >
      {/* Table toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-coffee-100">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-coffee-900">
            Individual Responses
          </h3>
          <p className="text-xs text-coffee-400 mt-0.5">
            {filtered.length} of {data.length} response
            {data.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-coffee-400 pointer-events-none" />
            <Input
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Source filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs"
              onClick={() => setShowFilterDropdown((p) => !p)}
            >
              <Filter className="w-3.5 h-3.5" />
              {sourceFilter === "All" ? "Source" : sourceFilter.split(" ")[0]}
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-10 z-20 w-52 bg-white border border-coffee-100 rounded-xl shadow-lg overflow-hidden">
                {["All", ...ALL_SOURCES].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSourceFilter(s);
                      setShowFilterDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-xs hover:bg-coffee-50 transition-colors",
                      sourceFilter === s
                        ? "bg-coffee-50 font-semibold text-coffee-800"
                        : "text-coffee-600"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CSV export */}
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs"
            onClick={() => downloadCSV(filtered)}
            disabled={filtered.length === 0}
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[520px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 bg-coffee-50/90 backdrop-blur-sm border-b border-coffee-100">
            <tr>
              {[
                "Name",
                "Email",
                "Frequency",
                "Source",
                "Reasons",
                "Productivity",
                "Side Effects",
                "Sleep",
                "Exam Usage",
                "Dependency",
                "Submitted",
              ].map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-3 font-semibold text-coffee-600 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-12 text-coffee-400 text-sm"
                >
                  {data.length === 0
                    ? "No responses yet. Share the survey link to collect data."
                    : "No results match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-coffee-50 hover:bg-coffee-50/60 transition-colors",
                    i % 2 === 0 ? "bg-white" : "bg-cream-50/30"
                  )}
                >
                  <td className="px-4 py-3 font-medium text-coffee-900 whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-coffee-500 whitespace-nowrap">
                    {row.email}
                  </td>
                  <td className="px-4 py-3 text-coffee-700 whitespace-nowrap">
                    {row.frequency}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-coffee-100 text-coffee-800 font-medium">
                      {row.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <MultiChips items={row.reasons} />
                  </td>
                  <td className="px-4 py-3">
                    <LikertBadge value={row.productivity} />
                  </td>
                  <td className="px-4 py-3">
                    <MultiChips items={row.sideEffects} />
                  </td>
                  <td className="px-4 py-3 text-coffee-700 whitespace-nowrap">
                    {row.sleepHours}
                  </td>
                  <td className="px-4 py-3 text-coffee-600 whitespace-nowrap max-w-[140px] truncate">
                    {row.examUsage}
                  </td>
                  <td className="px-4 py-3">
                    <LikertBadge value={row.dependency} />
                  </td>
                  <td className="px-4 py-3 text-coffee-400 whitespace-nowrap">
                    {new Date(row.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
