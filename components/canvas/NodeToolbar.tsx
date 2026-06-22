"use client";
import { nodeTypes } from "@/types/canvas";
import { useCanvasStore } from "@/store/canvasStore";
const symbols: Record<string, string> = { prompt: "✦", text: "T", image: "◈", video: "▶", audio: "♫", storyboard: "▦", reference: "⌁", output: "↗" };
export function NodeToolbar() { const addNode = useCanvasStore((state) => state.addNode); return <aside className="flex h-full w-48 shrink-0 flex-col border-r border-slate-800 bg-[#0c1622] p-3"><p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">Add node</p><div className="space-y-1">{nodeTypes.map((type) => <button key={type} onClick={() => addNode(type)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-slate-800 hover:text-cyan-200"><span className="grid h-6 w-6 place-items-center rounded bg-slate-800 text-cyan-300">{symbols[type]}</span>Add {type[0].toUpperCase()}{type.slice(1)}</button>)}</div></aside>; }
