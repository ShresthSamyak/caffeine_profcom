"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { SingleChoice } from "./questions/SingleChoice";
import { MultipleChoice } from "./questions/MultipleChoice";
import { LikertScale } from "./questions/LikertScale";
import { NumericSelect } from "./questions/NumericSelect";
import { surveyQuestions, TOTAL_QUESTIONS } from "@/lib/questions";
import type { SurveyAnswers } from "@/types";
import { ArrowLeft, ArrowRight, Coffee, Loader2, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SurveyContainerProps {
  userId: string;
  userName: string;
  onComplete: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export function SurveyContainer({ userId, userName, onComplete }: SurveyContainerProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = surveyQuestions[step];
  const currentAnswer = answers[currentQuestion.id];
  const firstName = userName.split(" ")[0];

  const isAnswered = () => {
    if (currentQuestion.type === "multiple") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return currentAnswer !== undefined && currentAnswer !== "";
  };

  const handleAnswer = (value: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!isAnswered()) return;
    if (step < TOTAL_QUESTIONS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, answers }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }

      toast({
        title: "Survey submitted!",
        description: "Thank you for your participation.",
      });
      onComplete();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Please try again.",
      });
      setSubmitting(false);
    }
  };

  const isLastStep = step === TOTAL_QUESTIONS - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-coffee-50 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-coffee-100">
        <div className="max-w-xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-coffee-500 to-coffee-700 rounded-xl flex items-center justify-center">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-coffee-700">
              Caffeine Survey
            </span>
            <span className="ml-auto text-xs text-coffee-400">
              Hi, {firstName}
            </span>
          </div>
          <ProgressBar current={step + 1} total={TOTAL_QUESTIONS} />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-coffee-100 shadow-xl shadow-coffee-100/30 p-6 md:p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-coffee-500 bg-coffee-50 px-3 py-1 rounded-full border border-coffee-200">
                      {step + 1} / {TOTAL_QUESTIONS}
                    </span>
                    {currentQuestion.type === "multiple" && (
                      <span className="text-xs font-medium text-coffee-400 bg-cream-100 px-3 py-1 rounded-full border border-cream-200">
                        Multi-select
                      </span>
                    )}
                    {currentQuestion.type === "likert" && (
                      <span className="text-xs font-medium text-coffee-400 bg-cream-100 px-3 py-1 rounded-full border border-cream-200">
                        Scale 1–5
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-coffee-950 leading-snug">
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.subtitle && (
                    <p className="text-sm text-coffee-500 mt-2">
                      {currentQuestion.subtitle}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  {currentQuestion.type === "single" && (
                    <SingleChoice
                      options={currentQuestion.options!}
                      value={currentAnswer as string}
                      onChange={handleAnswer}
                    />
                  )}
                  {currentQuestion.type === "multiple" && (
                    <MultipleChoice
                      options={currentQuestion.options!}
                      value={currentAnswer as string[]}
                      onChange={handleAnswer}
                    />
                  )}
                  {currentQuestion.type === "likert" && (
                    <LikertScale
                      value={currentAnswer as number}
                      onChange={handleAnswer}
                      minLabel={currentQuestion.minLabel}
                      maxLabel={currentQuestion.maxLabel}
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                    />
                  )}
                  {currentQuestion.type === "select" && (
                    <NumericSelect
                      options={currentQuestion.options!}
                      value={currentAnswer as string}
                      onChange={handleAnswer}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 px-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={step === 0 || submitting}
              className="text-coffee-500 hover:text-coffee-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <Button
              variant="primary"
              size="default"
              onClick={handleNext}
              disabled={!isAnswered() || submitting}
              className="min-w-[140px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting…
                </>
              ) : isLastStep ? (
                <>
                  Submit
                  <Send className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
