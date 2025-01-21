import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { LineChart as LineChartIcon, Timer, Trophy } from "lucide-react";

interface RatingChartProps {
  ratingHistory: Array<{ timestamp: number; rating: number }>;
}

export const RatingChart: React.FC<RatingChartProps> = ({ ratingHistory }) => {
  const maxRating = Math.max(...ratingHistory.map((h) => h.rating));
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString();

  const data = ratingHistory.map((point) => ({
    date: formatDate(point.timestamp),
    rating: point.rating,
  }));

  return (
    <div className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/30">
      <div className="flex items-center gap-2 mb-4">
        <LineChartIcon className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Rating Progress
        </h2>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Max: {maxRating}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Current: {ratingHistory[ratingHistory.length - 1]?.rating}
          </span>
        </div>
      </div>

      <div className="relative w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#374151" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#374151" }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin", "dataMax"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                color: "#000",
              }}
              labelStyle={{ fontWeight: "bold", color: "#000" }}
              formatter={(value: number) => `${value}`}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#3b82f6", fill: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
