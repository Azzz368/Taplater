import type { AIProvider } from "./types";

const pause = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));
const safe = (text: string) => text.replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[char] ?? char);

export const mockAIProvider: AIProvider = {
  async generateText(prompt) { await pause(); return `Creative draft: ${prompt.slice(0, 170)}. The tone is vivid, focused, and ready to develop.`; },
  async generateImage(prompt, size = "1024×1024") { await pause(550); const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#164e63"/><stop offset="1" stop-color="#7c2d12"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="640" cy="130" r="110" fill="#fbbf24" opacity=".8"/><path d="M0 420 Q190 220 370 390 T800 310 V520 H0Z" fill="#0b1320" opacity=".75"/><text x="42" y="55" fill="white" font-family="sans-serif" font-size="22">MOCK IMAGE • ${safe(size)}</text><text x="42" y="475" fill="#dbeafe" font-family="sans-serif" font-size="18">${safe(prompt.slice(0, 65))}</text></svg>`; return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`; },
  async generateVideo(prompt, duration = 5) { await pause(650); return { url: "mock://video/concept", status: `Concept ready · ${duration}s · ${prompt.slice(0, 42)}` }; },
  async generateAudio(prompt, duration = 10) { await pause(520); return { url: "mock://audio/track", status: `Audio sketch ready · ${duration}s · ${prompt.slice(0, 42)}` }; },
  async generateStoryboard(brief, scenes) { await pause(620); return Array.from({ length: scenes }, (_, i) => ({ sceneNumber: i + 1, description: `${brief.slice(0, 72)} — beat ${i + 1}`, visualPrompt: `Cinematic keyframe, scene ${i + 1}, ${brief.slice(0, 52)}`, camera: ["Wide orbit", "Close tracking", "Low angle", "Slow push-in"][i % 4], duration: 3 + (i % 3) })); },
};
