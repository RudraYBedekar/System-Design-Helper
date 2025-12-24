import { create } from "zustand";
import { Node, Edge } from "reactflow";

export interface Requirement {
  id: string;
  text: string;
}

export interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  description: string;
}

interface SystemState {
  systemName: string;
  functionalRequirements: Requirement[];
  nonFunctionalRequirements: Requirement[];
  constraints: Requirement[];
  apiEndpoints: ApiEndpoint[];
  nodes: Node[];
  edges: Edge[];
  setSystemName: (name: string) => void;
  addFunctionalRequirement: (requirement: Requirement) => void;
  updateFunctionalRequirement: (id: string, text: string) => void;
  deleteFunctionalRequirement: (id: string) => void;
  addNonFunctionalRequirement: (requirement: Requirement) => void;
  updateNonFunctionalRequirement: (id: string, text: string) => void;
  deleteNonFunctionalRequirement: (id: string) => void;
  addConstraint: (constraint: Requirement) => void;
  updateConstraint: (id: string, text: string) => void;
  deleteConstraint: (id: string) => void;
  addApiEndpoint: (endpoint: ApiEndpoint) => void;
  updateApiEndpoint: (id: string, endpoint: Partial<ApiEndpoint>) => void;
  deleteApiEndpoint: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

const defaultNodes: Node[] = [
  {
    id: "users",
    type: "custom",
    position: { x: 100, y: 100 },
    data: { label: "Users", type: "users", isActive: false },
  },
  {
    id: "dns",
    type: "custom",
    position: { x: 250, y: 100 },
    data: { label: "DNS", type: "dns", isActive: false, ip: "10.5.8.2" },
  },
  {
    id: "load-balancer",
    type: "custom",
    position: { x: 400, y: 100 },
    data: { label: "Load Balancer", type: "load-balancer", isActive: false, ip: "10.2.3.7" },
  },
  {
    id: "api-gateway",
    type: "custom",
    position: { x: 550, y: 100 },
    data: { label: "API Gateway", type: "api-gateway", isActive: false, ip: "10.5.8.2" },
  },
  {
    id: "app-server",
    type: "custom",
    position: { x: 700, y: 100 },
    data: { label: "App Server", type: "app-server", isActive: false, ip: "10.2.3.4", specs: "2 CPU, 4GB RAM" },
  },
  {
    id: "database",
    type: "custom",
    position: { x: 700, y: 250 },
    data: { label: "Database", type: "database", isActive: false },
  },
  {
    id: "cache",
    type: "custom",
    position: { x: 550, y: 250 },
    data: { label: "Cache", type: "cache", isActive: false },
  },
];

const defaultEdges: Edge[] = [
  { id: "e1-2", source: "users", target: "dns" },
  { id: "e2-3", source: "dns", target: "load-balancer" },
  { id: "e3-4", source: "load-balancer", target: "api-gateway" },
  { id: "e4-5", source: "api-gateway", target: "app-server" },
  { id: "e5-6", source: "app-server", target: "database" },
  { id: "e4-7", source: "api-gateway", target: "cache" },
];

export const useSystemStore = create<SystemState>((set) => ({
  systemName: "My System",
  functionalRequirements: [],
  nonFunctionalRequirements: [],
  constraints: [],
  apiEndpoints: [],
  nodes: defaultNodes,
  edges: defaultEdges,

  setSystemName: (name) => set({ systemName: name }),

  addFunctionalRequirement: (requirement) =>
    set((state) => ({
      functionalRequirements: [...state.functionalRequirements, requirement],
    })),

  updateFunctionalRequirement: (id, text) =>
    set((state) => ({
      functionalRequirements: state.functionalRequirements.map((req) =>
        req.id === id ? { ...req, text } : req
      ),
    })),

  deleteFunctionalRequirement: (id) =>
    set((state) => ({
      functionalRequirements: state.functionalRequirements.filter(
        (req) => req.id !== id
      ),
    })),

  addNonFunctionalRequirement: (requirement) =>
    set((state) => ({
      nonFunctionalRequirements: [
        ...state.nonFunctionalRequirements,
        requirement,
      ],
    })),

  updateNonFunctionalRequirement: (id, text) =>
    set((state) => ({
      nonFunctionalRequirements: state.nonFunctionalRequirements.map((req) =>
        req.id === id ? { ...req, text } : req
      ),
    })),

  deleteNonFunctionalRequirement: (id) =>
    set((state) => ({
      nonFunctionalRequirements: state.nonFunctionalRequirements.filter(
        (req) => req.id !== id
      ),
    })),

  addConstraint: (constraint) =>
    set((state) => ({
      constraints: [...state.constraints, constraint],
    })),

  updateConstraint: (id, text) =>
    set((state) => ({
      constraints: state.constraints.map((constraint) =>
        constraint.id === id ? { ...constraint, text } : constraint
      ),
    })),

  deleteConstraint: (id) =>
    set((state) => ({
      constraints: state.constraints.filter((constraint) => constraint.id !== id),
    })),

  addApiEndpoint: (endpoint) =>
    set((state) => ({
      apiEndpoints: [...state.apiEndpoints, endpoint],
    })),

  updateApiEndpoint: (id, endpoint) =>
    set((state) => ({
      apiEndpoints: state.apiEndpoints.map((ep) =>
        ep.id === id ? { ...ep, ...endpoint } : ep
      ),
    })),

  deleteApiEndpoint: (id) =>
    set((state) => ({
      apiEndpoints: state.apiEndpoints.filter((ep) => ep.id !== id),
    })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
}));

