import type { ButtonHTMLAttributes } from "react";
export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-100 transition hover:border-cyan-400 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />; }
