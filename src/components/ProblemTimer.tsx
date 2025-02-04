import React, { useState, useEffect } from "react";
import {
  Timer,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  HelpCircle,
  XCircle,
} from "lucide-react";

interface ProblemTimerProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: (timeSpent: number, solved: boolean, tookHelp: boolean) => void;
}

export const ProblemTimer: React.FC<ProblemTimerProps> = ({
  isRunning,
  onStart,
  onStop,
}) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pausedTime, setPausedTime] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: number;

    if (isRunning && startTime && !pausedTime) {
      intervalId = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, startTime, pausedTime]);

  const handleStart = () => {
    const now = Date.now();
    setStartTime(now);
    setElapsedTime(0);
    onStart();
  };

  const handlePause = () => {
    setPausedTime(Date.now());
  };

  const handleResume = () => {
    if (pausedTime && startTime) {
      setStartTime((prev) => prev! + (Date.now() - pausedTime));
      setPausedTime(null);
    }
  };

  const handleStop = (solved: boolean, tookHelp: boolean) => {
    if (startTime) {
      const timeSpent = (Date.now() - startTime) / 60000; // Convert to minutes
      onStop(timeSpent, solved, tookHelp);
      setStartTime(null);
      setElapsedTime(0);
      setPausedTime(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Timer Display */}
      <div className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg">
        <Timer className="w-5 h-5 text-blue-400" />
        <span className="font-mono text-xl text-white">
          {formatTime(elapsedTime)}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 bg-green-500/80 text-white px-4 py-3 rounded-lg hover:bg-green-600/80 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Start
          </button>
        ) : pausedTime ? (
          <button
            onClick={handleResume}
            className="flex items-center gap-2 bg-blue-500/80 text-white px-4 py-3 rounded-lg hover:bg-blue-600/80 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Resume
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 bg-gray-500/80 text-white px-4 py-3 rounded-lg hover:bg-gray-600/80 transition-colors"
          >
            <PauseCircle className="w-5 h-5" />
            Pause
          </button>
        )}
      </div>
      {/* Completion Buttons */}
      {isRunning && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleStop(true, false)}
            className="flex items-center gap-2 bg-green-500/80 text-white px-4 py-3 rounded-lg hover:bg-green-600/80 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Solved
          </button>
          <button
            onClick={() => handleStop(true, true)}
            className="flex items-center gap-2 bg-yellow-500/80 text-white px-4 py-3 rounded-lg hover:bg-yellow-600/80 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Solved with Help
          </button>
          <button
            onClick={() => handleStop(false, false)}
            className="flex items-center gap-2 bg-red-500/80 text-white px-4 py-3 rounded-lg hover:bg-red-600/80 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
