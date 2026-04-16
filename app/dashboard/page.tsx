"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PieChartCard } from "@/components/dashboard/PieChartCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { SideEffectsChart } from "@/components/dashboard/SideEffectsChart";
import { ResponsesTable } from "@/components/dashboard/ResponsesTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ParsedResponse } from "@/lib/parseResponses";
import {
  Coffee,
  BarChart3,
  Users,
  Zap,
  Lock,
  RefreshCw,
  LogOut,
  AlertCircle,
  Table2,
  TrendingUp,
  Percent,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface DashboardData {
  totalResponses: number;
  dailyCaffeinePercent: number;
  sourceData: { name: string; value: number }[];
  frequencyData: { name: string; responses: number; avgProductivity: number }[];
  sideEffectsData: { name: string; count: number }[];
  dependencyData: { name: string; value: number }[];
  responses: ParsedResponse[];
  demo?: boolean;
  empty?: boolean;
}

// ── Dashboard page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "responses">(
    "analytics"
  );

  const fetchData = useCallback(async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard", {
        headers: { "x-dashboard-password": pwd },
      });

      if (res.status === 401) {
        setAuthError("Incorrect password. Try again.");
        setAuthed(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to load data");

      const json: DashboardData = await res.json();
      setData(json);
      setAuthed(true);
      setAuthError("");
    } catch {
      setAuthError("Failed to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(password);
  };

  const handleLogout = () => {
    setAuthed(false);
    setData(null);
    setPassword("");
  };

  // ── Computed stats ──────────────────────────────────────────────────────
  const avgProductivity =
    data?.frequencyData && data.frequencyData.length > 0
      ? (
          data.frequencyData.reduce(
            (s, d) => s + d.avgProductivity * d.responses,
            0
          ) /
          Math.max(
            data.frequencyData.reduce((s, d) => s + d.responses, 0),
            1
          )
        ).toFixed(1)
      : "—";

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-950 to-coffee-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <BarChart3 className="w-8 h-8 text-coffee-200" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Research Dashboard</h1>
            <p className="text-coffee-300 text-sm mt-1">
              Enter the password to view results
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400 pointer-events-none" />
                <Input
                  type="password"
                  placeholder="Dashboard password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError("");
                  }}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-coffee-400 focus-visible:ring-coffee-400"
                  autoFocus
                />
              </div>

              <AnimatePresence>
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-300 text-xs"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {authError}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full bg-white text-coffee-900 hover:bg-cream-100 font-semibold"
                disabled={loading || !password}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4 mr-2" />
                )}
                {loading ? "Loading..." : "View Results"}
              </Button>
            </form>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-coffee-400 text-sm hover:text-coffee-200 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main dashboard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-coffee-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-coffee-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-coffee-500 to-coffee-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-coffee-900 truncate">
                Caffeine Survey — Research Dashboard
              </h1>
              {data?.demo && (
                <span className="text-xs text-amber-600 font-medium">
                  Demo data
                </span>
              )}
            </div>
          </div>

          {/* Tab toggle */}
          <div className="hidden sm:flex items-center bg-coffee-100/60 rounded-xl p-1 gap-1">
            {(["analytics", "responses"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize",
                  activeTab === tab
                    ? "bg-white text-coffee-900 shadow-sm"
                    : "text-coffee-500 hover:text-coffee-700"
                )}
              >
                {tab === "analytics" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <Table2 className="w-3.5 h-3.5" />
                )}
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchData(password)}
              disabled={loading}
              className="text-coffee-500"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-coffee-500"
            >
              <LogOut className="w-4 h-4" />
            </Button>
            <Button variant="primary" size="sm" asChild className="hidden sm:flex">
              <Link href="/survey">Take Survey</Link>
            </Button>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="sm:hidden flex border-t border-coffee-100">
          {(["analytics", "responses"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold capitalize transition-colors",
                activeTab === tab
                  ? "text-coffee-800 border-b-2 border-coffee-700"
                  : "text-coffee-400"
              )}
            >
              {tab === "analytics" ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <Table2 className="w-3.5 h-3.5" />
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ── Analytics tab ───────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Responses"
                  value={data?.totalResponses ?? 0}
                  subtitle="Survey completions"
                  icon={Users}
                  color="from-coffee-500 to-coffee-700"
                  delay={0}
                />
                <StatsCard
                  title="Daily Caffeine Users"
                  value={`${data?.dailyCaffeinePercent ?? 0}%`}
                  subtitle="Consume once/day or more"
                  icon={Percent}
                  color="from-amber-400 to-orange-500"
                  delay={0.08}
                />
                <StatsCard
                  title="Avg Productivity"
                  value={avgProductivity}
                  subtitle="Likert score out of 5"
                  icon={Zap}
                  color="from-lime-400 to-green-500"
                  delay={0.16}
                />
                <StatsCard
                  title="Top Source"
                  value={data?.sourceData?.[0]?.name ?? "—"}
                  subtitle={`${data?.sourceData?.[0]?.value ?? 0} respondents`}
                  icon={Coffee}
                  color="from-rose-400 to-pink-500"
                  delay={0.24}
                />
              </div>

              {/* Charts row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data?.sourceData && (
                  <PieChartCard
                    title="Primary Source of Caffeine"
                    subtitle="Which caffeine source do participants rely on most?"
                    data={data.sourceData}
                    delay={0.3}
                  />
                )}
                {data?.frequencyData && (
                  <BarChartCard
                    title="Caffeine Frequency vs Productivity"
                    subtitle="Average self-reported productivity score per frequency group"
                    data={data.frequencyData}
                    delay={0.38}
                  />
                )}
              </div>

              {/* Charts row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data?.sideEffectsData && (
                  <SideEffectsChart
                    data={data.sideEffectsData}
                    delay={0.46}
                  />
                )}
                {data?.dependencyData && (
                  <PieChartCard
                    title="Perceived Caffeine Dependency"
                    subtitle="How strongly do participants feel dependent on caffeine?"
                    data={data.dependencyData}
                    delay={0.54}
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* ── Responses tab ─────────────────────────────────────────── */}
          {activeTab === "responses" && (
            <motion.div
              key="responses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ResponsesTable data={data?.responses ?? []} delay={0.1} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo banner */}
        {data?.demo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Showing demo data
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Run{" "}
                <code className="bg-amber-100 px-1 rounded">
                  supabase-schema.sql
                </code>{" "}
                in your Supabase SQL Editor to create the tables, then real
                survey data will appear here automatically.
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {data?.empty && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-coffee-50 border border-coffee-100 rounded-2xl p-8 text-center"
          >
            <Coffee className="w-10 h-10 text-coffee-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-coffee-700">
              No responses yet
            </p>
            <p className="text-xs text-coffee-400 mt-1 mb-4">
              Share the survey link to start collecting data.
            </p>
            <Button variant="primary" size="sm" asChild>
              <Link href="/survey">Take the first survey →</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
