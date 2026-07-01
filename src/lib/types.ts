export type LikertValue = 0 | 1 | 2 | 3 | 4;

export type Question = {
  id: string;
  text: string;
  /** disorder ids this question contributes to */
  disorders: string[];
};

export type Disorder = {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  instrument?: string;
  /** min sum to flag positive screen */
  threshold: number;
  maxScore: number;
};

export type DisorderScore = {
  id: string;
  name: string;
  category: string;
  rawScore: number;
  maxScore: number;
  percent: number;
  positive: boolean;
  instrument?: string;
  shortDescription: string;
};

export type AssessmentAnswers = Record<string, LikertValue>;

export type AssessmentResult = {
  id: string;
  createdAt: string;
  answers: AssessmentAnswers;
  scores: DisorderScore[];
  positiveCount: number;
  overallPercent: number;
  narrative?: string;
  aiSummary?: string;
  aiRefined?: DisorderScore[];
  isDemo?: boolean;
};

export type AssessmentPhase = "intro" | "questions" | "narrative" | "analyzing" | "results";
