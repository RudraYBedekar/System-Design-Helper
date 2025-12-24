"use client";

import { useEffect, useState, useRef } from "react";
import { EdgeProps, getBezierPath } from "reactflow";

interface Packet {
  id: string;
  progress: number;
}

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  animated = false,
}: EdgeProps & { animated?: boolean }) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [packets, setPackets] = useState<Packet[]>([]);
  const animationFrameRef = useRef<number>();
  const packetIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!animated) {
      setPackets([]);
      if (packetIntervalRef.current) {
        clearInterval(packetIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    packetIntervalRef.current = setInterval(() => {
      setPackets((prev) => [
        ...prev,
        { id: `packet-${Date.now()}-${Math.random()}`, progress: 0 },
      ]);
    }, 1500);

    const animate = () => {
      setPackets((prev) => {
        const updated = prev
          .map((packet) => ({
            ...packet,
            progress: Math.min(packet.progress + 0.015, 1),
          }))
          .filter((packet) => packet.progress < 1);
        return updated;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (packetIntervalRef.current) {
        clearInterval(packetIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animated]);

  const getPointOnPath = (progress: number) => {
    try {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", edgePath);
      const length = path.getTotalLength();
      const point = path.getPointAtLength(length * progress);
      return { x: point.x, y: point.y };
    } catch {
      return { x: sourceX + (targetX - sourceX) * progress, y: sourceY + (targetY - sourceY) * progress };
    }
  };

  return (
    <>
      <path
        id={id}
        style={{ ...style, stroke: "#4a5568", strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {animated &&
        packets.map((packet) => {
          const point = getPointOnPath(packet.progress);
          return (
            <g key={packet.id} transform={`translate(${point.x}, ${point.y})`}>
              <circle
                r="6"
                fill="#10b981"
                style={{
                  filter: "drop-shadow(0 0 8px #10b981) drop-shadow(0 0 12px rgba(16, 185, 129, 0.5))",
                }}
              >
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
    </>
  );
}
