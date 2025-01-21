import React, { useState, useEffect } from "react";
import { Brain, Sun, Moon } from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { RatingChart } from "./components/RatingChart";
import { ProblemTimer } from "./components/ProblemTimer";
import { Statistics } from "./components/Statistics";
import Settings from "./components/Settings";
import { StartingRatingModal } from "./components/StartingRatingModal";
import { calculateRatingChange } from "./utils/ratingSystem";
import type { UserStats, Settings as SettingsType, Problem } from "./types";
import { LEETCODE_RATINGS } from "./types";

const DEFAULT_SETTINGS: SettingsType = {
  startingRating: 800,
  kFactor: 32,
  decayConstant: 0.1,
};

const CODEFORCES_RATINGS = [
  800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000,
];

function App() {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", true);
  const [hasSetStartingRating, setHasSetStartingRating] = useLocalStorage(
    "hasSetStartingRating",
    false
  );
  const [settings, setSettings] = useLocalStorage<SettingsType>(
    "settings",
    DEFAULT_SETTINGS
  );
  const [stats, setStats] = useLocalStorage<UserStats>("stats", {
    currentRating: settings.startingRating,
    solvedProblems: [],
    ratingHistory: [{ timestamp: Date.now(), rating: settings.startingRating }],
  });

  const [platform, setPlatform] = useState<"codeforces" | "leetcode">(
    "codeforces"
  );
  const [selectedRating, setSelectedRating] = useState(800);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleStartingRating = (rating: number) => {
    setSettings({ ...settings, startingRating: rating });
    setStats({
      currentRating: rating,
      solvedProblems: [],
      ratingHistory: [{ timestamp: Date.now(), rating }],
    });
    setHasSetStartingRating(true);
  };

  const handleStartProblem = () => {
    setCurrentProblem({
      id: Date.now().toString(),
      rating: selectedRating,
      platform,
      startTime: Date.now(),
    });
    setIsTimerRunning(true);
  };

  const handleCompleteProblem = (timeSpent: number) => {
    if (!currentProblem) return;

    const ratingChange = calculateRatingChange(
      currentProblem.rating,
      stats.currentRating,
      timeSpent,
      settings.kFactor,
      settings.decayConstant
    );

    const newRating = Math.max(stats.currentRating + ratingChange, 0);

    const completedProblem = {
      ...currentProblem,
      endTime: Date.now(),
      timeSpent,
      ratingChange,
    };

    setStats({
      currentRating: newRating,
      solvedProblems: [...stats.solvedProblems, completedProblem],
      ratingHistory: [
        ...stats.ratingHistory,
        { timestamp: Date.now(), rating: newRating },
      ],
    });

    setCurrentProblem(null);
    setIsTimerRunning(false);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This cannot be undone."
      )
    ) {
      setHasSetStartingRating(false);
      setStats({
        currentRating: settings.startingRating,
        solvedProblems: [],
        ratingHistory: [
          { timestamp: Date.now(), rating: settings.startingRating },
        ],
      });
    }
  };

  const handleExportData = () => {
    const data = {
      stats,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cc-trainer-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.stats && data.settings) {
          setStats(data.stats);
          setSettings(data.settings);
          setHasSetStartingRating(true);
        }
      } catch (error) {
        console.error("Error importing data:", error);
        alert("Invalid data file");
      }
    };
    reader.readAsText(file);
  };

  if (!hasSetStartingRating) {
    return <StartingRatingModal onSubmit={handleStartingRating} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CC Trainer v0.1
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-lg px-4 py-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/30 flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Current Rating:
              </span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {stats.currentRating}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <RatingChart ratingHistory={stats.ratingHistory} />
            <Statistics solvedProblems={stats.solvedProblems} />
          </div>

          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Problem Selection
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPlatform("codeforces")}
                      className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        platform === "codeforces"
                          ? "bg-blue-500"
                          : "bg-gray-500/50 hover:bg-gray-600/50"
                      }`}
                    >
                      Codeforces
                    </button>
                    <button
                      onClick={() => setPlatform("leetcode")}
                      className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        platform === "leetcode"
                          ? "bg-blue-500"
                          : "bg-gray-500/50 hover:bg-gray-600/50"
                      }`}
                    >
                      LeetCode
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {platform === "codeforces"
                      ? "Problem Rating"
                      : "Difficulty"}
                  </label>
                  <div className="relative">
                    {platform === "codeforces" ? (
                      <select
                        value={selectedRating}
                        onChange={(e) =>
                          setSelectedRating(Number(e.target.value))
                        }
                        className="block w-full p-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10 focus:border-blue-500 focus:ring-blue-500"
                      >
                        {CODEFORCES_RATINGS.map((rating) => (
                          <option key={rating} value={rating}>
                            {rating}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={selectedRating}
                        onChange={(e) =>
                          setSelectedRating(Number(e.target.value))
                        }
                        className="block w-full p-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10 focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value={LEETCODE_RATINGS.easy}>
                          Easy (800)
                        </option>
                        <option value={LEETCODE_RATINGS.medium}>
                          Medium (1300)
                        </option>
                        <option value={LEETCODE_RATINGS.hard}>
                          Hard (1600)
                        </option>
                      </select>
                    )}
                  </div>
                </div>

                <ProblemTimer
                  isRunning={isTimerRunning}
                  onStart={handleStartProblem}
                  onStop={handleCompleteProblem}
                />
              </div>
            </div>

            <Settings
              settings={settings}
              onReset={handleReset}
              onExportData={handleExportData}
              onImportData={handleImportData}
            />
          </div>
        </div>

        <footer className="text-center text-gray-600 dark:text-gray-400 pt-8">
          Made with ❤️ by Swastik Goswami
        </footer>
      </div>
    </div>
  );
}

export default App;
