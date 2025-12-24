"use client";

import { useEffect, useRef } from "react";
import { FiList, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export interface LogEntry {
    id: string;
    timestamp: number;
    message: string;
    type: "info" | "success" | "error";
    componentId?: string;
    duration?: number;
}

interface SimulationLogProps {
    logs: LogEntry[];
}

export default function SimulationLog({ logs }: SimulationLogProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg flex flex-col h-64">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2 flex-shrink-0">
                <FiList className="w-4 h-4" />
                Simulation Logs
            </h3>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar"
            >
                {logs.length === 0 ? (
                    <div className="text-gray-500 text-xs italic text-center mt-10">
                        Start simulation to see packet flow logs...
                    </div>
                ) : (
                    logs.map((log) => (
                        <div
                            key={log.id}
                            className={`text-xs p-2 rounded border-l-2 ${log.type === "error"
                                    ? "bg-red-900/20 border-red-500"
                                    : log.type === "success"
                                        ? "bg-green-900/20 border-green-500"
                                        : "bg-gray-700/50 border-blue-500"
                                }`}
                        >
                            <div className="flex justify-between items-start text-gray-300 mb-1">
                                <span className="flex items-center gap-1 font-mono opacity-70">
                                    <FiClock className="w-3 h-3" />
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", fractionDigits: 3 })}
                                </span>
                                {log.duration && (
                                    <span className="bg-gray-700 px-1 rounded text-[10px] text-gray-400">
                                        {log.duration}ms
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-200">
                                {log.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
