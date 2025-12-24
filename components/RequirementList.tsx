"use client";

import { useState } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { Requirement } from "@/store/useSystemStore";

interface RequirementListProps {
  title: string;
  requirements: Requirement[];
  onAdd: (requirement: Requirement) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export default function RequirementList({
  title,
  requirements,
  onAdd,
  onUpdate,
  onDelete,
}: RequirementListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [newText, setNewText] = useState("");

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      onUpdate(id, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleAdd = () => {
    if (newText.trim()) {
      onAdd({
        id: Date.now().toString(),
        text: newText.trim(),
      });
      setNewText("");
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {requirements.map((req) => (
          <div
            key={req.id}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            {editingId === req.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(req.id);
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                />
                <button
                  onClick={() => handleSaveEdit(req.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                >
                  <FiCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-gray-700">{req.text}</span>
                <button
                  onClick={() => handleStartEdit(req.id, req.text)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(req.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={`Add new ${title.toLowerCase()}`}
            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


