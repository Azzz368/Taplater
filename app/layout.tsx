import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Lumen Flow", description: "Creative AI workflow canvas" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
