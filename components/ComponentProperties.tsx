"use client";

import { useEffect, useState, useRef } from "react";
import { FiSave, FiCpu, FiHardDrive, FiActivity, FiGlobe } from "react-icons/fi";
import { Node } from "reactflow";

interface ComponentPropertiesProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: any) => void;
}

export default function ComponentProperties({ selectedNode, onUpdateNode }: ComponentPropertiesProps) {
  const [label, setLabel] = useState("");
  const [ip, setIp] = useState("");
  const [ram, setRam] = useState("");
  const [cpu, setCpu] = useState("");
  const prevNodeIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (selectedNode && selectedNode.id !== prevNodeIdRef.current) {
      // Only update local state if the selected node ID has changed
      // This prevents the form from resetting if the node updates (e.g. due to simulation animation)
      setLabel(selectedNode.data.label || "");
      setIp(selectedNode.data.ip || "");
      setRam(selectedNode.data.ram || "4 GB");
      setCpu(selectedNode.data.cpu || "2 Cores");
      prevNodeIdRef.current = selectedNode.id;
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        label,
        ip,
        ram,
        cpu,
        specs: `${ram} | ${cpu}`, // Update the visual specs string too
      });
    }
  };

  if (!selectedNode) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg mb-4 text-center text-gray-400">
        <p className="text-sm">Select a component to edit properties</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg mb-4">
      <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
        <FiSettingsIcon />
        Component Properties
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
            <FiActivity className="w-3 h-3" /> Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="Component Name"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
            <FiGlobe className="w-3 h-3" /> IP Address
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="192.168.1.1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
              <FiHardDrive className="w-3 h-3" /> RAM
            </label>
            <input
              type="text"
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. 16 GB"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
              <FiCpu className="w-3 h-3" /> CPU
            </label>
            <input
              type="text"
              value={cpu}
              onChange={(e) => setCpu(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. 4 Cores"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2"
        >
          <FiSave className="w-4 h-4" />
          Update Component
        </button>
      </div>
    </div>
  );
}

function FiSettingsIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  )
}
