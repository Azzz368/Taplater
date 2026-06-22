import Link from "next/link";

export default function Home() {
  return <main className="min-h-screen bg-[#091019] px-6 py-16 text-slate-100"><section className="mx-auto max-w-4xl pt-20 text-center"><p className="mb-5 text-sm font-semibold uppercase tracking-[.22em] text-cyan-300">Lumen Flow</p><h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">把创意变成<br/><span className="text-cyan-300">可运行的画布</span></h1><p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">一个原创的 AI 创作工作流空间，用于组织文本、图像、视频、音频与分镜构思。</p><Link className="mt-10 inline-flex rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200" href="/workspace">进入工作区 →</Link></section></main>;
}
