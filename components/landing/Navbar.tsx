"use client";

import Link from "next/link";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-coffee-500 to-coffee-800 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-coffee-900 tracking-tight">
            Caffeine<span className="text-coffee-500">Survey</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="#about"
            className="hidden md:block text-sm text-coffee-600 hover:text-coffee-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="/dashboard"
            className="hidden md:block text-sm text-coffee-600 hover:text-coffee-900 transition-colors"
          >
            Results
          </Link>
          <Button variant="primary" size="sm" asChild>
            <Link href="/survey">Take Survey</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
