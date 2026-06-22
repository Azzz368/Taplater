"use client";
import { ReactFlowProvider } from "@xyflow/react";
import { BottomRunBar } from "./BottomRunBar";
import { CreativeCanvas } from "./CreativeCanvas";
import { NodeToolbar } from "./NodeToolbar";
import { PropertyPanel } from "./PropertyPanel";
import { TemplateGallery } from "./TemplateGallery";
import { TopBar } from "./TopBar";
export function Workspace() { return <ReactFlowProvider><main className="flex h-screen flex-col overflow-hidden"><TopBar/><TemplateGallery/><div className="flex min-h-0 flex-1"><NodeToolbar/><CreativeCanvas/><PropertyPanel/></div><BottomRunBar/></main></ReactFlowProvider>; }
