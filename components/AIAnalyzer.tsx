"use client";

import { useState } from "react";
import { FiCpu, FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";

interface Issue {
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  suggestion: string;
}

interface AIAnalyzerProps {
  nodes: any[];
  edges: any[];
  onAnalyze: () => Promise<Issue[]>;
}

export default function AIAnalyzer({ nodes, edges, onAnalyze }: AIAnalyzerProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setShowResults(true);
    try {
      const results = await onAnalyze();
      setIssues(results);
    } catch (error) {
      console.error("Analysis error:", error);
      setIssues([
        {
          type: "error",
          title: "Analysis Error",
          description: "Failed to analyze architecture",
          suggestion: "Please check your network connection and try again",
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return <FiAlertCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <FiAlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <FiCheckCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-500/50";
      case "warning":
        return "border-yellow-500/50";
      default:
        return "border-blue-500/50";
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <FiCpu className="w-4 h-4" />
          AI Architecture Analyzer
        </h3>
        {showResults && (
          <button
            onClick={() => setShowResults(false)}
            className="text-gray-400 hover:text-white"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {!showResults ? (
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || nodes.length === 0}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isAnalyzing || nodes.length === 0
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          <FiCpu className="w-4 h-4" />
          {isAnalyzing ? "Analyzing..." : "Analyze Architecture"}
        </button>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {issues.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              <FiCheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p>No issues found! Your architecture looks good.</p>
            </div>
          ) : (
            issues.map((issue, index) => (
              <div
                key={index}
                className={`border-2 ${getBorderColor(issue.type)} bg-gray-900/50 rounded-lg p-3`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(issue.type)}
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{issue.title}</h4>
                    <p className="text-gray-300 text-sm mb-2">{issue.description}</p>
                    <div className="bg-gray-800 rounded p-2 mt-2">
                      <p className="text-xs text-gray-400 mb-1">Suggestion:</p>
                      <p className="text-sm text-blue-300">{issue.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

