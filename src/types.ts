export interface Problem {
  id: string;
  rating: number;
  platform: "codeforces" | "leetcode";
  startTime: number;
  endTime?: number;
  timeSpent?: number;
  ratingChange?: number;
}

export interface UserStats {
  currentRating: number;
  solvedProblems: Problem[];
  ratingHistory: Array<{
    timestamp: number;
    rating: number;
  }>;
}

export interface Settings {
  startingRating: number;
  kFactor: number;
  decayConstant: number;
}

export const LEETCODE_RATINGS = {
  easy: 800,
  medium: 1300,
  hard: 1600,
} as const;
