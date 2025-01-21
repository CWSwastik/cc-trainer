import React, { useState, useEffect } from 'react';
import { Timer, Play, Square } from 'lucide-react';

interface ProblemTimerProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: (timeSpent: number) => void;
}

export const ProblemTimer: React.FC<ProblemTimerProps> = ({
  isRunning,
  onStart,
  onStop,
}) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: number;

    if (isRunning && startTime) {
      intervalId = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, startTime]);

  const handleStart = () => {
    const now = Date.now();
    setStartTime(now);
    setElapsedTime(0);
    onStart();
  };

  const handleStop = () => {
    if (startTime) {
      const timeSpent = (Date.now() - startTime) / 60000; // Convert to minutes
      onStop(timeSpent);
      setStartTime(null);
      setElapsedTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg">
        <Timer className="w-5 h-5 text-blue-400" />
        <span className="font-mono text-xl text-white">{formatTime(elapsedTime)}</span>
      </div>
      
      {!isRunning ? (
        <button
          onClick={handleStart}
          className="flex items-center gap-2 bg-green-500/80 text-white px-4 py-2 rounded-lg hover:bg-green-600/80 transition-colors"
        >
          <Play className="w-5 h-5" />
          Start
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="flex items-center gap-2 bg-red-500/80 text-white px-4 py-2 rounded-lg hover:bg-red-600/80 transition-colors"
        >
          <Square className="w-5 h-5" />
          Complete
        </button>
      )}
    </div>
  );
};