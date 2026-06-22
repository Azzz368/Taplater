import { aiProvider } from "@/lib/ai/provider";
import type { CanvasNode, NodeOutput } from "@/types/canvas";

const output = (kind: string, summary: string, value: unknown): NodeOutput => ({ kind, summary, value, createdAt: new Date().toISOString() });
const inputSummary = (inputs: unknown[]) => inputs.map((input) => typeof input === "object" ? JSON.stringify(input).slice(0, 90) : String(input)).join("\n");
export async function runCanvasNode(node: CanvasNode, inputs: unknown[] = []): Promise<NodeOutput> {
  const d = node.data, upstream = inputSummary(inputs), prompt = [d.prompt, d.instruction, d.storyBrief, d.inputText, upstream].filter(Boolean).join("\n").trim();
  if (["prompt", "text", "image", "video", "audio", "storyboard"].includes(d.nodeType) && !prompt) throw new Error("Add a prompt or input before running this node.");
  switch (d.nodeType) {
    case "prompt": return output("prompt", "Structured prompt prepared", { prompt: d.prompt, negativePrompt: d.negativePrompt, style: d.style, aspectRatio: d.aspectRatio });
    case "text": { const value = await aiProvider.generateText(prompt); return output("text", value.slice(0, 90), value); }
    case "image": { const value = await aiProvider.generateImage(prompt, d.size); return output("image", "Mock image generated", value); }
    case "video": { const value = await aiProvider.generateVideo(prompt, d.duration); return output("video", value.status, value); }
    case "audio": { const value = await aiProvider.generateAudio(prompt, d.duration); return output("audio", value.status, value); }
    case "storyboard": { const value = await aiProvider.generateStoryboard(prompt, d.numberOfScenes ?? 3); return output("storyboard", `${value.length} scenes created`, value); }
    case "reference": return output("reference", "Reference material available", { imageUrl: d.imageUrl, notes: d.notes });
    case "output": return output("output", `${inputs.length} upstream result${inputs.length === 1 ? "" : "s"} collected`, inputs);
  }
}
