"use client";

import { useCallback } from "react";
import {
  FiServer,
  FiDatabase,
  FiCloud,
  FiLayers,
  FiZap,
  FiBox,
  FiGlobe,
  FiFile,
  FiSearch,
  FiBarChart,
  FiShield,
  FiCpu,
  FiHardDrive,
  FiActivity,
  FiUsers,
  FiMail,
  FiCreditCard,
  FiShoppingCart,
  FiLock,
  FiRefreshCw,
  FiShare2,
  FiGrid,
  FiRepeat,
  FiGitCommit,
} from "react-icons/fi";

export interface ComponentDefinition {
  id: string;
  label: string;
  type: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const components: ComponentDefinition[] = [
  {
    id: "users",
    label: "Users",
    type: "users",
    icon: <FiUsers className="w-5 h-5" />,
    color: "bg-blue-500",
    description: "User clients",
  },
  {
    id: "dns",
    label: "DNS",
    type: "dns",
    icon: <FiGlobe className="w-5 h-5" />,
    color: "bg-blue-500",
    description: "DNS resolution service",
  },
  {
    id: "api-gateway",
    label: "API Gateway",
    type: "api-gateway",
    icon: <FiLayers className="w-5 h-5" />,
    color: "bg-red-500",
    description: "API routing and management",
  },
  {
    id: "load-balancer",
    label: "Load Balancer",
    type: "load-balancer",
    icon: <FiZap className="w-5 h-5" />,
    color: "bg-cyan-500",
    description: "Elastic Load Balancer (ELB)",
  },
  {
    id: "rate-limiter",
    label: "Rate Limiter",
    type: "rate-limiter",
    icon: <FiShield className="w-5 h-5" />,
    color: "bg-yellow-500",
    description: "Rate limiting service",
  },
  {
    id: "web-server",
    label: "Web Server",
    type: "web-server",
    icon: <FiServer className="w-5 h-5" />,
    color: "bg-green-500",
    description: "Web application server",
  },
  {
    id: "app-server",
    label: "App Server",
    type: "app-server",
    icon: <FiServer className="w-5 h-5" />,
    color: "bg-emerald-500",
    description: "Application logic server",
  },
  {
    id: "auth-service",
    label: "Auth Service",
    type: "auth-service",
    icon: <FiLock className="w-5 h-5" />,
    color: "bg-orange-500",
    description: "Authentication service",
  },
  {
    id: "order-service",
    label: "Order Service",
    type: "order-service",
    icon: <FiShoppingCart className="w-5 h-5" />,
    color: "bg-purple-500",
    description: "Order processing service",
  },
  {
    id: "payment-service",
    label: "Payment Service",
    type: "payment-service",
    icon: <FiCreditCard className="w-5 h-5" />,
    color: "bg-pink-500",
    description: "Payment processing service",
  },
  {
    id: "email-service",
    label: "Email Service",
    type: "email-service",
    icon: <FiMail className="w-5 h-5" />,
    color: "bg-indigo-500",
    description: "Email notification service",
  },
  {
    id: "database",
    label: "Database",
    type: "database",
    icon: <FiDatabase className="w-5 h-5" />,
    color: "bg-red-500",
    description: "Primary database",
  },
  {
    id: "read-replica",
    label: "Read Replica",
    type: "read-replica",
    icon: <FiDatabase className="w-5 h-5" />,
    color: "bg-blue-500",
    description: "Database read replica",
  },
  {
    id: "cache",
    label: "Cache",
    type: "cache",
    icon: <FiZap className="w-5 h-5" />,
    color: "bg-orange-500",
    description: "In-memory cache (Redis)",
  },
  {
    id: "message-queue",
    label: "Message Queue",
    type: "message-queue",
    icon: <FiBox className="w-5 h-5" />,
    color: "bg-yellow-500",
    description: "Async message queue",
  },
  {
    id: "cdn",
    label: "CDN",
    type: "cdn",
    icon: <FiCloud className="w-5 h-5" />,
    color: "bg-indigo-500",
    description: "Content delivery network",
  },
  {
    id: "storage",
    label: "Object Storage",
    type: "storage",
    icon: <FiFile className="w-5 h-5" />,
    color: "bg-teal-500",
    description: "File and object storage",
  },
  {
    id: "search-engine",
    label: "Search Engine",
    type: "search-engine",
    icon: <FiSearch className="w-5 h-5" />,
    color: "bg-pink-500",
    description: "Full-text search",
  },
  {
    id: "analytics",
    label: "Analytics",
    type: "analytics",
    icon: <FiBarChart className="w-5 h-5" />,
    color: "bg-violet-500",
    description: "Data analytics service",
  },
  {
    id: "firewall",
    label: "Firewall",
    type: "firewall",
    icon: <FiShield className="w-5 h-5" />,
    color: "bg-rose-500",
    description: "Network security firewall",
  },
  {
    id: "microservice",
    label: "Microservice",
    type: "microservice",
    icon: <FiCpu className="w-5 h-5" />,
    color: "bg-sky-500",
    description: "Generic microservice",
  },
  {
    id: "data-warehouse",
    label: "Data Warehouse",
    type: "data-warehouse",
    icon: <FiHardDrive className="w-5 h-5" />,
    color: "bg-amber-500",
    description: "Data warehouse storage",
  },
  {
    id: "monitoring",
    label: "Monitoring",
    type: "monitoring",
    icon: <FiActivity className="w-5 h-5" />,
    color: "bg-lime-500",
    description: "System monitoring service",
  },
  {
    id: "bulk-service",
    label: "Bulk Service",
    type: "bulk-service",
    icon: <FiRefreshCw className="w-5 h-5" />,
    color: "bg-slate-500",
    description: "Bulk operations service",
  },
  {
    id: "graphql-gateway",
    label: "GraphQL Gateway",
    type: "graphql-gateway",
    icon: <FiShare2 className="w-5 h-5" />,
    color: "bg-pink-600",
    description: "Unified API Gateway",
  },
  {
    id: "service-mesh",
    label: "Service Mesh",
    type: "service-mesh",
    icon: <FiGrid className="w-5 h-5" />,
    color: "bg-indigo-600",
    description: "Microservices communication infrastructure",
  },
  {
    id: "event-bus",
    label: "Event Bus",
    type: "event-bus",
    icon: <FiRepeat className="w-5 h-5" />,
    color: "bg-orange-600",
    description: "Event-driven architecture bus",
  },
  {
    id: "cicd-pipeline",
    label: "CI/CD Pipeline",
    type: "cicd-pipeline",
    icon: <FiGitCommit className="w-5 h-5" />,
    color: "bg-gray-600",
    description: "Deployment pipeline",
  },
];

interface ComponentPaletteProps {
  onDragStart: (event: React.DragEvent, component: ComponentDefinition) => void;
}

export default function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Components</h2>
      <div className="space-y-2">
        {components.map((component) => (
          <div
            key={component.id}
            draggable
            onDragStart={(e) => onDragStart(e, component)}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-move hover:bg-gray-700 transition-colors"
            title={component.description}
          >
            <div className={`${component.color} p-2 rounded text-white`}>
              {component.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{component.label}</div>
              <div className="text-xs text-gray-400">{component.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { components };
