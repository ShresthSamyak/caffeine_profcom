"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PieChartCard } from "@/components/dashboard/PieChartCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { SideEffectsChart } from "@/components/dashboard/SideEffectsChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DashboardStats } from "@/types";
import {
  Coffee,
  BarChart3,
  Users,
  Zap,
  Lock,
  RefreshCw,
  LogOut,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const fetchStats = useCallback(async (pwd: string) => {
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

      const data = await res.json();
      setIsDemo(data.demo ?? false);
      setStats(data);
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
    fetchStats(password);
  };

  const handleRefresh = () => {
    fetchStats(password);
  };

  const handleLogout = () => {
    setAuthed(false);
    setStats(null);
    setPassword("");
  };

  // Login screen
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
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
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
            <Link href="/" className="text-coffee-400 text-sm hover:text-coffee-200 transition-colors">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-coffee-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-coffee-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-coffee-500 to-coffee-700 rounded-xl flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-coffee-900">
                Caffeine Survey Dashboard
              </h1>
              {isDemo && (
                <span className="text-xs text-amber-600 font-medium">
                  Demo data — connect Supabase for live results
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="text-coffee-500"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-coffee-500">
              <LogOut className="w-4 h-4" />
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/survey">Take Survey</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Responses"
            value={stats?.totalResponses ?? 0}
            subtitle="Survey completions"
            icon={Users}
            color="from-coffee-500 to-coffee-700"
            delay={0}
          />
          <StatsCard
            title="Top Source"
            value={stats?.sourceData?.[0]?.name ?? "—"}
            subtitle="Most popular caffeine source"
            icon={Coffee}
            color="from-amber-400 to-orange-500"
            delay={0.08}
          />
          <StatsCard
            title="Avg Productivity"
            value={
              stats?.frequencyData
                ? (
                    stats.frequencyData.reduce(
                      (s, d) => s + d.avgProductivity * d.responses,
                      0
                    ) /
                    Math.max(
                      stats.frequencyData.reduce((s, d) => s + d.responses, 0),
                      1
                    )
                  ).toFixed(1)
                : "—"
            }
            subtitle="Average Likert score (1–5)"
            icon={Zap}
            color="from-lime-400 to-green-500"
            delay={0.16}
          />
          <StatsCard
            title="Side Effects"
            value={stats?.sideEffectsData?.length ?? 0}
            subtitle="Distinct effects reported"
            icon={BarChart3}
            color="from-rose-400 to-pink-500"
            delay={0.24}
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats?.sourceData && (
            <PieChartCard
              title="Caffeine Source Breakdown"
              subtitle="Primary source chosen by participants"
              data={stats.sourceData}
              delay={0.3}
            />
          )}
          {stats?.frequencyData && (
            <BarChartCard
              title="Frequency vs Productivity"
              subtitle="Responses per frequency group vs average productivity score"
              data={stats.frequencyData}
              delay={0.38}
            />
          )}
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats?.sideEffectsData && (
            <SideEffectsChart data={stats.sideEffectsData} delay={0.46} />
          )}
          {stats?.dependencyData && (
            <PieChartCard
              title="Perceived Dependency"
              subtitle="How strongly participants feel dependent on caffeine"
              data={stats.dependencyData}
              delay={0.54}
            />
          )}
        </div>

        {isDemo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Showing demo data
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Configure <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                and <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                in your <code className="bg-amber-100 px-1 rounded">.env.local</code> to see real survey data.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
