"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";

export interface ComponentData {
  label: string;
  type: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  ip?: string;
  specs?: string;
  ram?: string;
  cpu?: string;
}

const nodeStyles: Record<string, {
  bg: string;
  border: string;
  text: string;
  shape: string;
  glow: string;
}> = {
  users: {
    bg: "bg-blue-900/30",
    border: "border-blue-400",
    text: "text-blue-200",
    shape: "rounded-full",
    glow: "shadow-blue-400/50"
  },
  dns: {
    bg: "bg-blue-900/30",
    border: "border-blue-400",
    text: "text-blue-200",
    shape: "rounded-lg",
    glow: "shadow-blue-400/50"
  },
  "api-gateway": {
    bg: "bg-red-900/30",
    border: "border-red-500",
    text: "text-red-200",
    shape: "rounded-lg",
    glow: "shadow-red-500/50"
  },
  "load-balancer": {
    bg: "bg-cyan-900/30",
    border: "border-cyan-400",
    text: "text-cyan-200",
    shape: "rounded-lg",
    glow: "shadow-cyan-400/50"
  },
  "rate-limiter": {
    bg: "bg-yellow-900/30",
    border: "border-yellow-500",
    text: "text-yellow-200",
    shape: "rounded-lg",
    glow: "shadow-yellow-500/50"
  },
  "web-server": {
    bg: "bg-green-900/30",
    border: "border-green-400",
    text: "text-green-200",
    shape: "rounded-lg",
    glow: "shadow-green-400/50"
  },
  "app-server": {
    bg: "bg-emerald-900/30",
    border: "border-emerald-400",
    text: "text-emerald-200",
    shape: "rounded-lg",
    glow: "shadow-emerald-400/50"
  },
  "auth-service": {
    bg: "bg-orange-900/30",
    border: "border-orange-500",
    text: "text-orange-200",
    shape: "rounded-lg",
    glow: "shadow-orange-500/50"
  },
  "order-service": {
    bg: "bg-purple-900/30",
    border: "border-purple-400",
    text: "text-purple-200",
    shape: "rounded-lg",
    glow: "shadow-purple-400/50"
  },
  "payment-service": {
    bg: "bg-pink-900/30",
    border: "border-pink-400",
    text: "text-pink-200",
    shape: "rounded-lg",
    glow: "shadow-pink-400/50"
  },
  "email-service": {
    bg: "bg-indigo-900/30",
    border: "border-indigo-400",
    text: "text-indigo-200",
    shape: "rounded-lg",
    glow: "shadow-indigo-400/50"
  },
  database: {
    bg: "bg-red-900/30",
    border: "border-red-500",
    text: "text-red-200",
    shape: "rounded-lg",
    glow: "shadow-red-500/50"
  },
  "read-replica": {
    bg: "bg-blue-900/30",
    border: "border-blue-400",
    text: "text-blue-200",
    shape: "rounded-lg",
    glow: "shadow-blue-400/50"
  },
  cache: {
    bg: "bg-orange-900/30",
    border: "border-orange-500",
    text: "text-orange-200",
    shape: "rounded-lg",
    glow: "shadow-orange-500/50"
  },
  "message-queue": {
    bg: "bg-yellow-900/30",
    border: "border-yellow-500",
    text: "text-yellow-200",
    shape: "rounded-lg",
    glow: "shadow-yellow-500/50"
  },
  cdn: {
    bg: "bg-indigo-900/30",
    border: "border-indigo-400",
    text: "text-indigo-200",
    shape: "rounded-lg",
    glow: "shadow-indigo-400/50"
  },
  storage: {
    bg: "bg-teal-900/30",
    border: "border-teal-400",
    text: "text-teal-200",
    shape: "rounded-lg",
    glow: "shadow-teal-400/50"
  },
  "search-engine": {
    bg: "bg-pink-900/30",
    border: "border-pink-400",
    text: "text-pink-200",
    shape: "rounded-lg",
    glow: "shadow-pink-400/50"
  },
  analytics: {
    bg: "bg-violet-900/30",
    border: "border-violet-400",
    text: "text-violet-200",
    shape: "rounded-lg",
    glow: "shadow-violet-400/50"
  },
  firewall: {
    bg: "bg-rose-900/30",
    border: "border-rose-500",
    text: "text-rose-200",
    shape: "rounded-lg",
    glow: "shadow-rose-500/50"
  },
  microservice: {
    bg: "bg-sky-900/30",
    border: "border-sky-400",
    text: "text-sky-200",
    shape: "rounded-lg",
    glow: "shadow-sky-400/50"
  },
  "data-warehouse": {
    bg: "bg-amber-900/30",
    border: "border-amber-500",
    text: "text-amber-200",
    shape: "rounded-lg",
    glow: "shadow-amber-500/50"
  },
  monitoring: {
    bg: "bg-lime-900/30",
    border: "border-lime-400",
    text: "text-lime-200",
    shape: "rounded-lg",
    glow: "shadow-lime-400/50"
  },
  "bulk-service": {
    bg: "bg-slate-800/30",
    border: "border-slate-400",
    text: "text-slate-200",
    shape: "rounded-lg",
    glow: "shadow-slate-400/50"
  },
  "graphql-gateway": {
    bg: "bg-pink-900/30",
    border: "border-pink-400",
    text: "text-pink-200",
    shape: "rounded-lg",
    glow: "shadow-pink-400/50"
  },
  "service-mesh": {
    bg: "bg-indigo-900/30",
    border: "border-indigo-400",
    text: "text-indigo-200",
    shape: "rounded-lg",
    glow: "shadow-indigo-400/50"
  },
  "event-bus": {
    bg: "bg-orange-900/30",
    border: "border-orange-400",
    text: "text-orange-200",
    shape: "rounded-lg",
    glow: "shadow-orange-400/50"
  },
  "cicd-pipeline": {
    bg: "bg-gray-800/30",
    border: "border-gray-400",
    text: "text-gray-200",
    shape: "rounded-lg",
    glow: "shadow-gray-400/50"
  },
};

function CustomNode({ data, selected, id }: NodeProps<ComponentData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const style = nodeStyles[data.type] || nodeStyles.microservice;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditLabel(data.label);
  }, [data.label]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditLabel(data.label);
  };

  const handleSave = () => {
    if (editLabel.trim()) {
      const event = new CustomEvent("reactflow:update-node", {
        detail: {
          id,
          data: { ...data, label: editLabel.trim() }
        }
      });
      window.dispatchEvent(event);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditLabel(data.label);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleDelete = () => {
    const event = new CustomEvent("reactflow:delete-node", { detail: { id } });
    window.dispatchEvent(event);
  };

  return (
    <div
      className={`relative group px-4 py-3 border-2 ${style.bg} ${style.border} ${selected ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900" : ""
        } ${data.isActive
          ? `animate-pulse shadow-lg scale-105 ${style.glow} shadow-green-500/70`
          : `transition-all duration-200 hover:shadow-xl hover:scale-105 ${style.glow} shadow-lg`
        } min-w-[140px] ${style.shape} backdrop-blur-sm`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => !isEditing && setShowActions(false)}
      style={{
        boxShadow: data.isActive
          ? `0 0 20px ${style.glow.replace('shadow-', '').replace('/50', '')}, 0 0 40px rgba(16, 185, 129, 0.3)`
          : `0 4px 6px rgba(0, 0, 0, 0.3), 0 0 10px ${style.glow.replace('shadow-', '').replace('/50', '')}`
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 ${data.isActive ? "bg-green-400 animate-pulse shadow-green-400 shadow-lg" : "bg-white/60"} hover:bg-white border border-gray-600`}
        style={{
          boxShadow: data.isActive ? "0 0 10px #10b981" : "0 0 5px rgba(255, 255, 255, 0.5)"
        }}
      />

      {isEditing ? (
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="flex-1 px-2 py-1 text-sm border-2 border-blue-500 rounded focus:outline-none text-white bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={handleSave}
            className="p-1 text-green-400 hover:bg-green-900/50 rounded"
            title="Save (Enter)"
          >
            <FiCheck className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-400 hover:bg-red-900/50 rounded"
            title="Cancel (Esc)"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div
            className={`text-center font-semibold ${style.text} text-sm cursor-text select-none ${data.isActive ? "animate-pulse" : ""
              }`}
            onDoubleClick={handleDoubleClick}
            title="Double-click to edit"
          >
            {data.label}
          </div>
          {data.ip && (
            <div className={`text-center text-xs ${style.text} opacity-80 mt-1 font-mono`}>
              {data.ip}
            </div>
          )}
          {data.specs && (
            <div className={`text-center text-xs ${style.text} opacity-60 mt-0.5`}>
              {data.specs}
            </div>
          )}
          {showActions && selected && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1 bg-gray-800 border border-gray-600 text-white px-2 py-1 rounded shadow-lg z-10">
              <button
                onClick={handleDoubleClick}
                className="p-1 hover:bg-gray-700 rounded"
                title="Edit label"
              >
                <FiEdit2 className="w-3 h-3" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-red-900/50 rounded"
                title="Delete node"
              >
                <FiTrash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 ${data.isActive ? "bg-green-400 animate-pulse shadow-green-400 shadow-lg" : "bg-white/60"} hover:bg-white border border-gray-600`}
        style={{
          boxShadow: data.isActive ? "0 0 10px #10b981" : "0 0 5px rgba(255, 255, 255, 0.5)"
        }}
      />
    </div>
  );
}

export default memo(CustomNode);
