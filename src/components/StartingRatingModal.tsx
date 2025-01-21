import React, { useState } from "react";
import { Brain } from "lucide-react";

interface StartingRatingModalProps {
  onSubmit: (rating: number) => void;
}

export const StartingRatingModal: React.FC<StartingRatingModalProps> = ({
  onSubmit,
}) => {
  const [rating, setRating] = useState(800);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating);
  };

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to the CC Trainer
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please enter your starting rating (you can use your Codeforces Contest
          Rating or leave it at 800). This will be used to calculate your rating
          changes as you solve problems.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Starting Rating
            </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min={800}
              max={3500}
              className="block w-full p-2 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Training 🚀
          </button>
        </form>
      </div>
    </div>
  );
};
