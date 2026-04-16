"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CaffeineMolecule } from "@/components/landing/CaffeineMolecule";
import { ArrowRight, Coffee, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface UserIntakeProps {
  onComplete: (userId: string, name: string) => void;
}

export function UserIntake({ onComplete }: UserIntakeProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      toast({
        title: "Welcome aboard!",
        description: data.demo
          ? `Hey ${name.split(" ")[0]}, running in demo mode.`
          : `Hey ${name.split(" ")[0]}, let's get started.`,
      });
      onComplete(data.userId, name.trim());
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-coffee-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-coffee-500 to-coffee-800 rounded-3xl flex items-center justify-center shadow-xl shadow-coffee-200">
                <Coffee className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-cream-100 rounded-full border-2 border-coffee-200 flex items-center justify-center">
                <CaffeineMolecule size={18} />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-coffee-950 tracking-tight">
            Let&apos;s start with you
          </h1>
          <p className="text-coffee-500 mt-2 text-sm leading-relaxed">
            A quick intro before we dive into the caffeine questions.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-coffee-100 shadow-xl shadow-coffee-100/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
                className={errors.name ? "border-red-400 focus-visible:ring-red-400" : ""}
                autoComplete="name"
                autoFocus
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                className={errors.email ? "border-red-400 focus-visible:ring-red-400" : ""}
                autoComplete="email"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Begin Survey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-coffee-400 mt-6">
          Your information is kept private and used only for this research.
        </p>
      </motion.div>
    </div>
  );
}
