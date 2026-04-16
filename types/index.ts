export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface SurveyResponse {
  id: string;
  user_id: string;
  answers: Record<string, unknown>;
  created_at: string;
}

export type QuestionType = "single" | "multiple" | "likert" | "select";

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  subtitle?: string;
  options?: string[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface SurveyAnswers {
  [questionId: number]: string | string[] | number;
}

export type SurveyStep = "landing" | "intake" | "survey" | "success";

export interface DashboardStats {
  totalResponses: number;
  sourceData: { name: string; value: number }[];
  frequencyData: { name: string; responses: number; avgProductivity: number }[];
  sideEffectsData: { name: string; count: number }[];
  dependencyData: { name: string; value: number }[];
}
