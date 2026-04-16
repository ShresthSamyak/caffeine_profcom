"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CaffeineMolecule } from "./CaffeineMolecule";
import { ArrowRight, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-coffee-50 via-cream-50 to-white" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-coffee-100/40 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream-200/60 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      {/* Floating molecule decorations */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-16 hidden lg:block text-coffee-300 opacity-50"
      >
        <CaffeineMolecule size={160} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 left-12 hidden lg:block text-coffee-200 opacity-40"
      >
        <CaffeineMolecule size={120} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-coffee-50 border border-coffee-200 rounded-full px-4 py-2 mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-coffee-600" />
          <span className="text-xs font-semibold text-coffee-700 tracking-wide uppercase">
            Caffeine Research Study 2025
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-coffee-950 leading-[1.05] mb-6"
        >
          How does
          <br />
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-coffee-600 to-coffee-800 bg-clip-text text-transparent">
              caffeine
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="absolute bottom-2 left-0 right-0 h-3 bg-coffee-200/60 rounded -z-10 origin-left"
            />
          </span>{" "}
          affect
          <br />
          your life?
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-coffee-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Join our study on caffeine consumption patterns. Takes 3 minutes.
          Your data helps uncover how coffee, tea, and energy drinks shape
          productivity, sleep, and well-being.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button variant="primary" size="xl" asChild>
            <Link href="/survey">
              Take the Survey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <Link href="#about" className="text-coffee-600">
              Learn more
            </Link>
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-coffee-400"
        >
          {["3 minutes", "9 questions", "Anonymous & private"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-coffee-400" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Coffee cup illustration */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
      >
        <CoffeeCupIllustration />
      </motion.div>
    </section>
  );
}

function CoffeeCupIllustration() {
  return (
    <svg
      width="200"
      height="160"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-10"
    >
      {/* Steam */}
      <path
        d="M70 40 Q65 25 70 15 Q75 5 70 0"
        stroke="#6F4E37"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M100 35 Q95 20 100 10 Q105 0 100 -5"
        stroke="#6F4E37"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M130 40 Q125 25 130 15 Q135 5 130 0"
        stroke="#6F4E37"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cup */}
      <path
        d="M40 60 L55 140 L145 140 L160 60 Z"
        fill="#6F4E37"
        opacity="0.8"
      />
      {/* Coffee surface */}
      <ellipse cx="100" cy="60" rx="60" ry="12" fill="#5C3D2E" />
      {/* Handle */}
      <path
        d="M160 80 Q185 80 185 100 Q185 120 160 120"
        stroke="#6F4E37"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      {/* Saucer */}
      <ellipse cx="100" cy="145" rx="75" ry="12" fill="#8B5E3C" opacity="0.4" />
    </svg>
  );
}
