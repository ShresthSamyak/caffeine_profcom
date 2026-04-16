"use client";

import { motion } from "framer-motion";
import { Coffee, Brain, Moon, Zap, BarChart3, Clock } from "lucide-react";

const features = [
  {
    icon: Coffee,
    title: "Consumption Patterns",
    description:
      "We explore what you drink, when, and how often — mapping the caffeine landscape of modern life.",
    color: "from-coffee-400 to-coffee-600",
  },
  {
    icon: Brain,
    title: "Cognitive Impact",
    description:
      "Does your morning brew actually sharpen your mind? We measure perceived productivity with rigorous scales.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Moon,
    title: "Sleep & Recovery",
    description:
      "The relationship between caffeine timing and sleep quality — explored through self-reported data.",
    color: "from-indigo-400 to-purple-500",
  },
  {
    icon: Zap,
    title: "Energy & Dependency",
    description:
      "Are you a casual sipper or a caffeine-dependent professional? Our scale captures the full spectrum.",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: BarChart3,
    title: "Real-time Insights",
    description:
      "See aggregated results as they come in — interactive charts built from real participant data.",
    color: "from-green-400 to-teal-500",
  },
  {
    icon: Clock,
    title: "3 Minutes Only",
    description:
      "Nine carefully crafted questions — enough for meaningful data, short enough to respect your time.",
    color: "from-rose-400 to-pink-500",
  },
];

export function Features() {
  return (
    <section id="about" className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold tracking-widest text-coffee-500 uppercase mb-4 block">
              What we explore
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-coffee-950 tracking-tight mb-6">
              Science meets your
              <br />
              <span className="text-coffee-600">morning ritual</span>
            </h2>
            <p className="text-coffee-500 text-lg max-w-xl mx-auto leading-relaxed">
              Our survey dives into six key dimensions of caffeine use — from
              your first sip to your last thought at night.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="group h-full bg-white border border-coffee-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-coffee-100/50 hover:border-coffee-200 transition-all duration-300 hover:-translate-y-1">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-coffee-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-coffee-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
