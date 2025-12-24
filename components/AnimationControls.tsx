"use client";

import { FiPlay, FiPause, FiSquare, FiRotateCcw } from "react-icons/fi";

interface AnimationControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export default function AnimationControls({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onReset,
}: AnimationControlsProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
      <button
        onClick={isPlaying ? onPause : onPlay}
        className={`p-2 rounded transition-colors ${
          isPlaying
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
      </button>
      <button
        onClick={onStop}
        className="p-2 rounded bg-red-600 hover:bg-red-700 transition-colors"
        title="Stop"
      >
        <FiSquare className="w-5 h-5" />
      </button>
      <button
        onClick={onReset}
        className="p-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors"
        title="Reset"
      >
        <FiRotateCcw className="w-5 h-5" />
      </button>
      <div className="ml-4 px-3 py-1 bg-gray-700 rounded text-sm">
        {isPlaying ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Running
          </span>
        ) : (
          <span>Stopped</span>
        )}
      </div>
    </div>
  );
}


