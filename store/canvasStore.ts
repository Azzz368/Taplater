"use client";
import { addEdge, applyEdgeChanges, applyNodeChanges, type Connection, type EdgeChange, type NodeChange } from "@xyflow/react";
import { create } from "zustand";
import { runCanvasNode } from "@/lib/workflow/nodeRunners";
import { topologicalSort } from "@/lib/workflow/topologicalSort";
import { canvasStorage } from "@/lib/storage/canvasStorage";
import { buildTemplate, makeNode, type Template } from "@/lib/templates/templates";
import type { CanvasNode, CanvasNodeData, CanvasSnapshot, NodeOutput, NodeType, WorkflowEdge } from "@/types/canvas";

type CanvasState = { projectName: string; nodes: CanvasNode[]; edges: WorkflowEdge[]; selectedNodeId: string | null; lastError: string | null;
  setProjectName(name: string): void; setSelectedNode(id: string | null): void; onNodesChange(changes: NodeChange<CanvasNode>[]): void; onEdgesChange(changes: EdgeChange<WorkflowEdge>[]): void; onConnect(connection: Connection): void;
  addNode(type: NodeType): void; updateNodeData(id: string, patch: Partial<CanvasNodeData>): void; removeNode(id: string): void; duplicateNode(id: string): void; setCanvas(nodes: CanvasNode[], edges: WorkflowEdge[]): void;
  runNode(id: string): Promise<void>; runWorkflow(): Promise<void>; saveCanvas(): void; loadCanvas(): void; clearCanvas(): void; exportCanvasJson(): string; importCanvasJson(raw: string): void; applyTemplate(template: Template): void; };
const initialNodes: CanvasNode[] = [];
const isSnapshot = (value: unknown): value is CanvasSnapshot => Boolean(value && typeof value === "object" && Array.isArray((value as CanvasSnapshot).nodes) && Array.isArray((value as CanvasSnapshot).edges));
export const useCanvasStore = create<CanvasState>((set, get) => ({
  projectName: "Untitled creative flow", nodes: initialNodes, edges: [], selectedNodeId: null, lastError: null,
  setProjectName: (projectName) => set({ projectName }), setSelectedNode: (selectedNodeId) => set({ selectedNodeId }),
  onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) as CanvasNode[] })), onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  onConnect: (connection) => set((state) => ({ edges: addEdge({ ...connection, id: `edge-${crypto.randomUUID()}`, animated: true }, state.edges) })),
  addNode: (type) => { const node = makeNode(type, { x: 160 + (get().nodes.length % 4) * 55, y: 120 + (get().nodes.length % 5) * 60 }); set((state) => ({ nodes: [...state.nodes, node], selectedNodeId: node.id })); },
  updateNodeData: (id, patch) => set((state) => ({ nodes: state.nodes.map((node) => node.id === id ? { ...node, data: { ...node.data, ...patch } } : node) })),
  removeNode: (id) => set((state) => ({ nodes: state.nodes.filter((node) => node.id !== id), edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id), selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId })),
  duplicateNode: (id) => { const original = get().nodes.find((node) => node.id === id); if (!original) return; const clone: CanvasNode = { ...original, id: `${original.data.nodeType}-${crypto.randomUUID()}`, position: { x: original.position.x + 36, y: original.position.y + 36 }, selected: true, data: { ...original.data, title: `${original.data.title} copy`, status: "idle", output: undefined, error: undefined } }; set((state) => ({ nodes: [...state.nodes.map((node) => ({ ...node, selected: false })), clone], selectedNodeId: clone.id })); },
  setCanvas: (nodes, edges) => set({ nodes, edges, selectedNodeId: null, lastError: null }),
  runNode: async (id) => { const state = get(), node = state.nodes.find((item) => item.id === id); if (!node) return; set((current) => ({ nodes: current.nodes.map((item) => item.id === id ? { ...item, data: { ...item.data, status: "running", error: undefined } } : item), lastError: null })); try { const inputs = get().edges.filter((edge) => edge.target === id).map((edge) => get().nodes.find((item) => item.id === edge.source)?.data.output?.value).filter((value): value is NonNullable<typeof value> => value !== undefined); const result: NodeOutput = await runCanvasNode(node, inputs); set((current) => ({ nodes: current.nodes.map((item) => item.id === id ? { ...item, data: { ...item.data, status: "success", output: result } } : item) })); } catch (error) { const message = error instanceof Error ? error.message : "Node execution failed"; set((current) => ({ lastError: message, nodes: current.nodes.map((item) => item.id === id ? { ...item, data: { ...item.data, status: "error", error: message } } : item) })); throw error; } },
  runWorkflow: async () => { try { set({ lastError: null }); const ordered = topologicalSort(get().nodes, get().edges); for (const node of ordered) await get().runNode(node.id); } catch (error) { if (error instanceof Error) set({ lastError: error.message }); } },
  saveCanvas: () => { const { projectName, nodes, edges } = get(); canvasStorage.save({ version: 1, projectName, nodes, edges }); },
  loadCanvas: () => { try { const snapshot = canvasStorage.load(); if (!snapshot || !isSnapshot(snapshot)) throw new Error("No valid saved canvas found."); set({ projectName: snapshot.projectName || "Untitled creative flow", nodes: snapshot.nodes, edges: snapshot.edges, selectedNodeId: null, lastError: null }); } catch (error) { set({ lastError: error instanceof Error ? error.message : "Could not load canvas" }); } },
  clearCanvas: () => set({ nodes: [], edges: [], selectedNodeId: null, lastError: null }),
  exportCanvasJson: () => { const { projectName, nodes, edges } = get(); return JSON.stringify({ version: 1, projectName, nodes, edges }, null, 2); },
  importCanvasJson: (raw) => { try { const value = JSON.parse(raw) as unknown; if (!isSnapshot(value)) throw new Error("Invalid canvas JSON. Expected nodes and edges arrays."); set({ projectName: value.projectName || "Imported creative flow", nodes: value.nodes, edges: value.edges, selectedNodeId: null, lastError: null }); } catch (error) { set({ lastError: error instanceof Error ? error.message : "Could not import JSON" }); } },
  applyTemplate: (template) => { const flow = buildTemplate(template); set({ nodes: flow.nodes, edges: flow.edges, projectName: template.name, selectedNodeId: null, lastError: null }); },
}));
