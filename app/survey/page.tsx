"use client";

import { useState } from "react";
import { UserIntake } from "@/components/survey/UserIntake";
import { SurveyContainer } from "@/components/survey/SurveyContainer";
import { SuccessScreen } from "@/components/survey/SuccessScreen";

type Step = "intake" | "survey" | "success";

export default function SurveyPage() {
  const [step, setStep] = useState<Step>("intake");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  const handleIntakeComplete = (id: string, name: string) => {
    setUserId(id);
    setUserName(name);
    setStep("survey");
  };

  const handleSurveyComplete = () => {
    setStep("success");
  };

  if (step === "intake") {
    return <UserIntake onComplete={handleIntakeComplete} />;
  }

  if (step === "survey") {
    return (
      <SurveyContainer
        userId={userId}
        userName={userName}
        onComplete={handleSurveyComplete}
      />
    );
  }

  return <SuccessScreen userName={userName} />;
}
