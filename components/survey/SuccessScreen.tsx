"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Coffee, Heart, BarChart3, Sparkles } from "lucide-react";
import Link from "next/link";

interface SuccessScreenProps {
  userName: string;
}

const confettiItems = ["☕", "⚡", "✨", "💫", "🧪", "⚗️", "🌟", "💡"];

export function SuccessScreen({ userName }: SuccessScreenProps) {
  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-cream-50 to-white flex items-center justify-center p-4 overflow-hidden">
      {/* Floating confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confettiItems.map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: Math.random() * 100 + "%", opacity: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 720 - 360,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.3,
              ease: "easeIn",
            }}
            className="absolute text-2xl select-none"
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg text-center relative z-10"
      >
        {/* Main icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-coffee-500 to-coffee-800 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-coffee-300">
              <Coffee className="w-14 h-14 text-white" />
            </div>
            {/* Steam */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [-5, -20], opacity: [0.7, 0] }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute top-2 w-2 h-6 bg-coffee-200 rounded-full"
                style={{ left: `${30 + i * 18}%` }}
              />
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4 mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-950 tracking-tight">
            Thank you,
            <br />
            <span className="text-coffee-600">{firstName}!</span>
          </h1>
          <p className="text-coffee-500 text-lg leading-relaxed max-w-sm mx-auto">
            Your responses have been recorded. You&apos;re helping us understand
            caffeine habits one cup at a time.
          </p>
        </motion.div>

        {/* Stats badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center mb-10"
        >
          {[
            { icon: Coffee, label: "Survey Complete", color: "text-coffee-700" },
            { icon: Heart, label: "Data Saved", color: "text-rose-500" },
            { icon: BarChart3, label: "9 Questions", color: "text-amber-600" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-coffee-100 rounded-full px-4 py-2 shadow-sm"
            >
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-sm font-medium text-coffee-700">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button variant="primary" size="lg" asChild>
            <Link href="/dashboard">View Results</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
