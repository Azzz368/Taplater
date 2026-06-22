import type { StoryboardScene } from "@/types/canvas";
export interface AIProvider {
  generateText(prompt: string): Promise<string>;
  generateImage(prompt: string, size?: string): Promise<string>;
  generateVideo(prompt: string, duration?: number): Promise<{ url: string; status: string }>;
  generateAudio(prompt: string, duration?: number): Promise<{ url: string; status: string }>;
  generateStoryboard(brief: string, scenes: number): Promise<StoryboardScene[]>;
}
