"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ComponentPalette, { ComponentDefinition } from "@/components/ComponentPalette";
import CustomNode from "@/components/nodes/CustomNode";
import ComponentProperties from "@/components/ComponentProperties";
import SimulationLog, { LogEntry } from "@/components/SimulationLog";
import AnimatedEdge from "@/components/AnimatedEdge";
import AnimationControls from "@/components/AnimationControls";
import RequestSimulator from "@/components/RequestSimulator";
import AIAnalyzer from "@/components/AIAnalyzer";
import ShortcutsModal from "@/components/ShortcutsModal";
import StickyNoteNode from "@/components/nodes/StickyNoteNode";
import { useSystemStore } from "@/store/useSystemStore";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  NodeTypes,
  EdgeTypes,
  MarkerType,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
  "sticky-note": StickyNoteNode,
};

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

interface Issue {
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  suggestion: string;
}

function ArchitectureDiagram() {
  const { nodes: storeNodes, edges: storeEdges, setNodes, setEdges } =
    useSystemStore();
  const [nodes, setNodesState, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(storeEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeNodeIds, setActiveNodeIds] = useState<Set<string>>(new Set());
  const [requestStats, setRequestStats] = useState({ sent: 0, processed: 0, failed: 0 });
  const [simulationLogs, setSimulationLogs] = useState<LogEntry[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const requestSimulationRef = useRef<NodeJS.Timeout | null>(null);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const isInitialMount = useRef(true);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setNodesState(storeNodes);
    setEdgesState(storeEdges);
  }, [storeNodes, storeEdges, setNodesState, setEdgesState]);

  useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  const updateNodeData = (nodeId: string, newData: any) => {
    setNodesState((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  };

  const addSimLog = (message: string, type: "info" | "success" | "error" = "info", duration?: number) => {
    setSimulationLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        message,
        type,
        duration,
      },
    ]);
  };

  useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const startSimulation = useCallback(() => {
    stopSimulation();

    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;
    const clientNodes = currentNodes.filter((n) =>
      n.data.type === "client" || n.data.type === "users" || n.data.type === "dns"
    );
    if (clientNodes.length === 0) return;

    const activateNode = (nodeId: string) => {
      setActiveNodeIds((prev) => {
        if (prev.has(nodeId)) return prev;
        return new Set([...prev, nodeId]);
      });
      setNodesState((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, isActive: true } }
            : node
        )
      );

      setTimeout(() => {
        setActiveNodeIds((prev) => {
          const next = new Set(prev);
          next.delete(nodeId);
          return next;
        });
        setNodesState((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, isActive: false } }
              : node
          )
        );
      }, 800);
    };

    const simulateFlow = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const clients = nodes.filter((n) =>
        n.data.type === "client" || n.data.type === "users" || n.data.type === "dns"
      );

      clients.forEach((clientNode) => {
        activateNode(clientNode.id);

        const findPath = (currentNodeId: string, visited: Set<string> = new Set()) => {
          if (visited.has(currentNodeId)) return;
          visited.add(currentNodeId);

          const outgoingEdges = edges.filter((e) => e.source === currentNodeId);

          outgoingEdges.forEach((edge, index) => {
            setTimeout(() => {
              activateNode(edge.target);
              findPath(edge.target, new Set(visited));
            }, index * 300 + 500);
          });
        };

        setTimeout(() => findPath(clientNode.id), 200);
      });
    };

    simulateFlow();
    simulationIntervalRef.current = setInterval(simulateFlow, 4000);
  }, [setNodesState]);

  const stopSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setActiveNodeIds((prev) => {
      if (prev.size === 0) return prev;
      return new Set();
    });
    setNodesState((nds) => {
      const hasActive = nds.some((node) => node.data.isActive);
      if (!hasActive) return nds;
      return nds.map((node) => ({ ...node, data: { ...node.data, isActive: false } }));
    });
  }, [setNodesState]);

  const handleRequestSimulation = useCallback((requestCount: number, requestsPerSecond: number) => {
    setIsSimulating(true);
    setRequestStats({ sent: 0, processed: 0, failed: 0 });
    setSimulationLogs([]); // Clear logs on start
    addSimLog(`Starting simulation with ${requestCount} requests...`, "info");

    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;
    const clientNodes = currentNodes.filter((n) =>
      n.data.type === "client" || n.data.type === "users" || n.data.type === "dns"
    );

    if (clientNodes.length === 0) {
      setIsSimulating(false);
      return;
    }

    let sent = 0;
    let processed = 0;
    let failed = 0;

    const sendRequest = () => {
      if (sent >= requestCount) {
        setIsSimulating(false);
        if (requestSimulationRef.current) {
          clearInterval(requestSimulationRef.current);
        }
        return;
      }

      sent++;
      setRequestStats((prev) => ({ ...prev, sent }));

      const clientNode = clientNodes[Math.floor(Math.random() * clientNodes.length)];

      const activateNode = (nodeId: string, delay: number) => {
        setTimeout(() => {
          setActiveNodeIds((prev) => new Set([...prev, nodeId]));
          setNodesState((nds) =>
            nds.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, isActive: true } }
                : node
            )
          );

          setTimeout(() => {
            setActiveNodeIds((prev) => {
              const next = new Set(prev);
              next.delete(nodeId);
              return next;
            });
            setNodesState((nds) =>
              nds.map((node) =>
                node.id === nodeId
                  ? { ...node, data: { ...node.data, isActive: false } }
                  : node
              )
            );
          }, 500);
        }, delay);
      };

      const processRequest = (nodeId: string, visited: Set<string>, delay: number) => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        // Calculate processing time based on node specs
        const node = currentNodes.find(n => n.id === nodeId);
        let processingTime = 200; // Base time
        if (node && node.data.ram) {
          const ram = parseInt(node.data.ram) || 4;
          processingTime = Math.max(50, 200 - (ram * 5)); // Faster with more RAM
        }

        activateNode(nodeId, delay);

        setTimeout(() => {
          addSimLog(`Request processed by ${node?.data.label || 'Node'}`, "info", processingTime);
        }, delay + processingTime);

        const outgoingEdges = currentEdges.filter((e) => e.source === nodeId);
        if (outgoingEdges.length === 0) {
          setTimeout(() => {
            processed++;
            setRequestStats((prev) => ({ ...prev, processed }));
            addSimLog(`Request completed successfully`, "success");
          }, delay + processingTime);
        } else {
          outgoingEdges.forEach((edge, index) => {
            processRequest(edge.target, new Set(visited), delay + processingTime + (index + 1) * 200);
          });
        }
      };

      processRequest(clientNode.id, new Set(), 0);
    };

    const interval = 1000 / requestsPerSecond;
    requestSimulationRef.current = setInterval(sendRequest, interval) as any;
  }, [setNodesState]);

  useEffect(() => {
    if (isPlaying) {
      startSimulation();
    } else {
      stopSimulation();
    }
    return () => {
      stopSimulation();
    };
  }, [isPlaying, startSimulation, stopSimulation]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    stopSimulation();
    setIsSimulating(false);
    if (requestSimulationRef.current) {
      clearInterval(requestSimulationRef.current);
    }
  };

  const handleReset = () => {
    handleStop();
    setActiveNodeIds(new Set());
    setRequestStats({ sent: 0, processed: 0, failed: 0 });
    setNodesState((nds) =>
      nds.map((node) => ({ ...node, data: { ...node.data, isActive: false } }))
    );
  };

  const analyzeArchitecture = useCallback(async (): Promise<Issue[]> => {
    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;
    const issues: Issue[] = [];

    // Check for missing load balancer
    const hasLoadBalancer = currentNodes.some((n) => n.data.type === "load-balancer");
    const hasMultipleServers = currentNodes.filter((n) =>
      n.data.type === "web-server" || n.data.type === "app-server"
    ).length > 1;

    if (hasMultipleServers && !hasLoadBalancer) {
      issues.push({
        type: "warning",
        title: "Missing Load Balancer",
        description: "You have multiple servers but no load balancer to distribute traffic.",
        suggestion: "Add a Load Balancer component to distribute requests evenly across your servers.",
      });
    }

    // Check for single point of failure (database)
    const databases = currentNodes.filter((n) => n.data.type === "database");
    if (databases.length === 1) {
      const hasReplica = currentNodes.some((n) => n.data.type === "read-replica");
      if (!hasReplica) {
        issues.push({
          type: "warning",
          title: "Single Database Instance",
          description: "You have only one database, which creates a single point of failure.",
          suggestion: "Consider adding Read Replicas for high availability and better read performance.",
        });
      }
    }

    // Check for missing cache
    const hasCache = currentNodes.some((n) => n.data.type === "cache");
    const hasDatabase = databases.length > 0;
    if (hasDatabase && !hasCache) {
      issues.push({
        type: "info",
        title: "No Caching Layer",
        description: "Adding a cache can significantly improve performance by reducing database load.",
        suggestion: "Add a Cache component (like Redis) between your application servers and database.",
      });
    }

    // Check for API Gateway
    const hasApiGateway = currentNodes.some((n) => n.data.type === "api-gateway");
    const hasMicroservices = currentNodes.filter((n) =>
      n.data.type === "auth-service" ||
      n.data.type === "order-service" ||
      n.data.type === "payment-service" ||
      n.data.type === "microservice"
    ).length > 0;

    if (hasMicroservices && !hasApiGateway) {
      issues.push({
        type: "warning",
        title: "Microservices Without API Gateway",
        description: "You have microservices but no API Gateway to route requests.",
        suggestion: "Add an API Gateway to manage routing, authentication, and rate limiting for your microservices.",
      });
    }

    // Check for disconnected nodes
    const nodeIds = new Set(currentNodes.map((n) => n.id));
    const connectedNodeIds = new Set<string>();
    currentEdges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const disconnectedNodes = currentNodes.filter((n) => !connectedNodeIds.has(n.id));
    if (disconnectedNodes.length > 0) {
      issues.push({
        type: "warning",
        title: "Disconnected Components",
        description: `You have ${disconnectedNodes.length} component(s) that are not connected to the rest of the architecture.`,
        suggestion: "Connect all components to ensure proper data flow. Disconnected components won't receive or send data.",
      });
    }

    // Check for missing rate limiting
    const hasRateLimiter = currentNodes.some((n) => n.data.type === "rate-limiter");
    if (!hasRateLimiter && currentNodes.length > 3) {
      issues.push({
        type: "info",
        title: "Consider Rate Limiting",
        description: "Rate limiting helps protect your system from traffic spikes and DDoS attacks.",
        suggestion: "Add a Rate Limiter component to control the number of requests per second.",
      });
    }

    // Check for too many connections to a single node (potential bottleneck)
    const connectionCounts = new Map<string, number>();
    currentEdges.forEach((edge) => {
      connectionCounts.set(edge.target, (connectionCounts.get(edge.target) || 0) + 1);
    });

    connectionCounts.forEach((count, nodeId) => {
      if (count > 5) {
        const node = currentNodes.find((n) => n.id === nodeId);
        if (node) {
          issues.push({
            type: "warning",
            title: "Potential Bottleneck",
            description: `${node.data.label} receives connections from ${count} sources, which might cause performance issues.`,
            suggestion: "Consider adding a load balancer or distributing the load across multiple instances.",
          });
        }
      }
    });

    return issues;
  }, []);

  useEffect(() => {
    const handleDeleteNode = (event: CustomEvent) => {
      const nodeId = event.detail.id;
      setNodesState((nds) => nds.filter((node) => node.id !== nodeId));
      setEdgesState((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    };

    const handleUpdateNode = (event: CustomEvent) => {
      const { id: nodeId, data: newData } = event.detail;
      setNodesState((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
        )
      );
    };

    window.addEventListener("reactflow:delete-node" as any, handleDeleteNode as EventListener);
    window.addEventListener("reactflow:update-node" as any, handleUpdateNode as EventListener);
    return () => {
      window.removeEventListener("reactflow:delete-node" as any, handleDeleteNode as EventListener);
      window.removeEventListener("reactflow:update-node" as any, handleUpdateNode as EventListener);
    };
  }, [setNodesState, setEdgesState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && selectedNodeId) {
        event.preventDefault();
        setNodesState((nds) => nds.filter((node) => node.id !== selectedNodeId));
        setEdgesState((eds) =>
          eds.filter(
            (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
          )
        );
        setSelectedNodeId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, setNodesState, setEdgesState]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdges = addEdge(
        {
          ...params,
          type: "animated",
          animated: isPlaying || isSimulating,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        },
        edges
      );
      setEdgesState(newEdges);
    },
    [edges, setEdgesState, isPlaying, isSimulating]
  );

  useEffect(() => {
    setEdgesState((eds) =>
      eds.map((edge) => ({
        ...edge,
        type: "animated",
        animated: isPlaying || isSimulating,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }))
    );
  }, [isPlaying, isSimulating, setEdgesState]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const componentData: ComponentDefinition = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      if (typeof componentData === "undefined" || !componentData) {
        return;
      }

      if (!reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${componentData.type}-${Date.now()}`,
        type: "custom",
        position,
        data: {
          label: componentData.label,
          type: componentData.type,
          isActive: false,
        },
      };

      setNodesState((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodesState]
  );

  const onDragStart = (event: React.DragEvent, component: ComponentDefinition) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/reactflow", JSON.stringify(component));
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Architecture Diagram
                <button
                  onClick={() => setShowShortcuts(true)}
                  className="text-gray-400 hover:text-white text-sm bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                >
                  Need Help?
                </button>
              </h1>
              <p className="text-gray-400 mt-1">
                Drag components from the palette • Double-click nodes to edit • Press Delete to remove
              </p>
            </div>
            <AnimationControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              onReset={handleReset}
            />
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <ComponentPalette onDragStart={onDragStart} />
          <div className="flex-1 relative dark-grid-bg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              className="bg-transparent"
              deleteKeyCode={["Delete", "Backspace"]}
              connectionMode={ConnectionMode.Loose}
            >
              <Background color="#1a1a1a" gap={20} size={1} />
              <Controls className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg" />
              <MiniMap
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
                nodeColor={(node) => {
                  const colors: Record<string, string> = {
                    users: "#3b82f6",
                    dns: "#3b82f6",
                    client: "#3b82f6",
                    "api-gateway": "#ef4444",
                    "load-balancer": "#06b6d4",
                    "rate-limiter": "#eab308",
                    "web-server": "#10b981",
                    "app-server": "#059669",
                    "auth-service": "#f97316",
                    "order-service": "#a855f7",
                    "payment-service": "#ec4899",
                    "email-service": "#6366f1",
                    database: "#ef4444",
                    "read-replica": "#3b82f6",
                    cache: "#f97316",
                    "message-queue": "#eab308",
                    cdn: "#6366f1",
                    storage: "#14b8a6",
                    "search-engine": "#ec4899",
                    analytics: "#8b5cf6",
                    firewall: "#f43f5e",
                    microservice: "#0ea5e9",
                    "data-warehouse": "#f59e0b",
                    monitoring: "#84cc16",
                    "bulk-service": "#64748b",
                  };
                  return colors[node.data?.type] || "#3b82f6";
                }}
              />
            </ReactFlow>
          </div>
          <div className="w-96 bg-gray-800 border-l border-gray-700 p-4 space-y-4 overflow-y-auto">
            <ComponentProperties
              selectedNode={nodes.find(n => n.id === selectedNodeId) || null}
              onUpdateNode={updateNodeData}
            />
            {isSimulating && <SimulationLog logs={simulationLogs} />}
            <RequestSimulator
              onStartSimulation={handleRequestSimulation}
              isRunning={isSimulating}
            />
            {isSimulating && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-2">Request Statistics</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Sent:</span>
                    <span className="text-blue-400">{requestStats.sent}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Processed:</span>
                    <span className="text-green-400">{requestStats.processed}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Failed:</span>
                    <span className="text-red-400">{requestStats.failed}</span>
                  </div>
                </div>
              </div>
            )}
            <AIAnalyzer
              nodes={nodes}
              edges={edges}
              onAnalyze={analyzeArchitecture}
            />
          </div>
        </div>
      </div>
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}

export default function HomePage() {
  return (
    <ReactFlowProvider>
      <ArchitectureDiagram />
    </ReactFlowProvider>
  );
}
