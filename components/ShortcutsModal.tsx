import React from 'react';
import { FiX, FiCommand } from 'react-icons/fi';

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
    if (!isOpen) return null;

    const shortcuts = [
        { key: "Delete / Backspace", action: "Remove selected node" },
        { key: "Shift + Click", action: "Select multiple nodes" },
        { key: "Shift + Drag", action: "Create selection box" },
        { key: "Scroll", action: "Zoom in text area" },
        { key: "Double Click", action: "Edit node label" },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FiCommand /> Keyboard Shortcuts
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <FiX size={20} />
                    </button>
                </div>

                <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex justify-between items-center text-sm border-b border-gray-700/50 pb-2 last:border-0">
                            <span className="text-gray-300">{shortcut.action}</span>
                            <code className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-blue-400 font-mono text-xs">
                                {shortcut.key}
                            </code>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                    <p className="text-xs text-gray-500">Pro Tip: Use Sticky Notes to explain your design.</p>
                </div>
            </div>
        </div>
    );
}
