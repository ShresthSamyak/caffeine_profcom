"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CaffeineMolecule } from "./CaffeineMolecule";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-32 bg-gradient-to-br from-coffee-800 to-coffee-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-coffee-600/30 via-transparent to-transparent" />
      <div className="absolute top-8 right-8 text-coffee-400/20 hidden lg:block">
        <CaffeineMolecule size={200} />
      </div>
      <div className="absolute bottom-8 left-8 text-coffee-400/15 hidden lg:block">
        <CaffeineMolecule size={150} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 bg-coffee-700/50 border border-coffee-600/50 rounded-full px-4 py-2 text-xs font-semibold text-coffee-200 tracking-widest uppercase mb-8">
            3 minutes · 9 questions · Anonymous
          </span>

          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Ready to decode your
            <br />
            <span className="text-coffee-300">caffeine story?</span>
          </h2>

          <p className="text-coffee-300 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Every cup has a story. Be part of the research that maps how
            caffeine shapes focus, sleep, and dependency across thousands of
            people.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              className="bg-white text-coffee-900 hover:bg-cream-100 font-bold shadow-xl hover:shadow-2xl"
              asChild
            >
              <Link href="/survey">
                Take the Survey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-coffee-500 text-coffee-200 hover:bg-coffee-700"
              asChild
            >
              <Link href="/dashboard">See Results</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
