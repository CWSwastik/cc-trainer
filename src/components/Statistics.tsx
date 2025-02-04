import React from "react";
import { Clock, Award, BarChart } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Problem } from "../types";

interface StatisticsProps {
  solvedProblems: Problem[];
}

export const Statistics: React.FC<StatisticsProps> = ({ solvedProblems }) => {
  const ratingRanges = [
    { min: 800, max: 1200, label: "800-1199" },
    { min: 1200, max: 1600, label: "1200-1599" },
    { min: 1600, max: 2000, label: "1600-1999" },
    { min: 2000, max: 2400, label: "2000-2399" },
    { min: 2400, max: 3000, label: "2400+" },
  ];

  const calculateAverageTime = (
    problems: Problem[],
    minRating: number,
    maxRating: number
  ) => {
    const filteredProblems = problems.filter(
      (p) => p.rating >= minRating && p.rating < maxRating && p.timeSpent
    );

    if (filteredProblems.length === 0) return 0;

    return (
      filteredProblems.reduce((acc, p) => acc + (p.timeSpent || 0), 0) /
      filteredProblems.length
    );
  };

  const countProblemsByRating = (
    problems: Problem[],
    minRating: number,
    maxRating: number
  ) => {
    return problems.filter((p) => p.rating >= minRating && p.rating < maxRating)
      .length;
  };

  const data = ratingRanges.map((range) => ({
    label: range.label,
    avgTime: calculateAverageTime(solvedProblems, range.min, range.max),
    problemCount: countProblemsByRating(solvedProblems, range.min, range.max),
  }));

  return (
    <div className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/30">
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Statistics
        </h2>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Award className="w-5 h-5 text-yellow-500" />
          <span className="text-lg text-gray-900 dark:text-white">
            Total Problems: {solvedProblems.length}
          </span>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-lg text-gray-900 dark:text-white">
                Average Solving Times
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <RechartsBarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) => value.toFixed(2)}
                    domain={[0, "dataMax"]}
                  />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)} minutes`}
                  />
                  <Legend />
                  <Bar
                    dataKey="avgTime"
                    name="Average Time"
                    fill="rgba(59, 130, 246, 0.8)"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="w-5 h-5 text-blue-500" />
              <span className="text-lg text-gray-900 dark:text-white">
                Problems by Rating
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <RechartsBarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    domain={[0, "dataMax"]}
                  />
                  <Tooltip formatter={(value: number) => `${value} problems`} />
                  <Legend />
                  <Bar
                    dataKey="problemCount"
                    name="Problems Solved"
                    fill="rgba(34, 197, 94, 0.8)"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
