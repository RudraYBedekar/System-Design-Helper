"use client";

import { useState } from "react";
import { FiPlay, FiSettings, FiHelpCircle } from "react-icons/fi";

interface RequestSimulatorProps {
  onStartSimulation: (requestCount: number, requestsPerSecond: number) => void;
  isRunning: boolean;
}

export default function RequestSimulator({ onStartSimulation, isRunning }: RequestSimulatorProps) {
  const [requestCount, setRequestCount] = useState(100);
  const [requestsPerSecond, setRequestsPerSecond] = useState(10);
  const [showSettings, setShowSettings] = useState(false);

  const handleStart = () => {
    onStartSimulation(requestCount, requestsPerSecond);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <FiSettings className="w-4 h-4" />
          Request Simulator
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-400 hover:text-white"
          title="Toggle settings"
        >
          <FiHelpCircle className="w-4 h-4" />
        </button>
      </div>

      {showSettings && (
        <div className="space-y-3 mb-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Total Requests: {requestCount}
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={requestCount}
              onChange={(e) => setRequestCount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10</span>
              <span>1000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Requests/Second: {requestsPerSecond}
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={requestsPerSecond}
              onChange={(e) => setRequestsPerSecond(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>50</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={isRunning}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          isRunning
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        <FiPlay className="w-4 h-4" />
        {isRunning ? "Simulation Running..." : `Send ${requestCount} Requests`}
      </button>

      {showSettings && (
        <p className="text-xs text-gray-500 mt-2">
          Simulate real-world traffic to test your architecture and identify bottlenecks
        </p>
      )}
    </div>
  );
}


