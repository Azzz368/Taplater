"use client";
import { templates } from "@/lib/templates/templates";
import { useCanvasStore } from "@/store/canvasStore";
export function TemplateGallery() { const applyTemplate = useCanvasStore((state) => state.applyTemplate); return <div className="border-b border-slate-800 bg-[#0c1622] px-4 py-2"><div className="flex items-center gap-2 overflow-x-auto"><span className="shrink-0 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">Templates</span>{templates.map((template) => <button onClick={() => applyTemplate(template)} key={template.id} title={template.description} className="shrink-0 rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400 hover:text-cyan-200">{template.name}</button>)}</div></div>; }
