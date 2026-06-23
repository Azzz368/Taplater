import "server-only";
import { TokenStarError } from "../errors";
const origin = () => (process.env.TOKENSTAR_API_ORIGIN || "https://api.tokenstar.io").replace(/\/$/, "");
const message = (value: unknown) => value && typeof value === "object" && typeof (value as { message?: unknown }).message === "string" ? (value as { message: string }).message : "TokenStar request failed.";
async function request<T>(path: string, init: RequestInit = {}) { const key = process.env.TOKENSTAR_API_KEY; if (!key) throw new TokenStarError("TokenStar API key is missing. Please set TOKENSTAR_API_KEY.", 500); const multipart = typeof FormData !== "undefined" && init.body instanceof FormData; const response = await fetch(`${origin()}${path}`, { ...init, cache: "no-store", headers: { Authorization: `Bearer ${key}`, Accept: "application/json", ...(multipart ? {} : { "Content-Type": "application/json" }), ...init.headers } }); const raw = await response.text(); let body: unknown = raw; try { body = raw ? JSON.parse(raw) : {}; } catch { /* preserve text */ } if (!response.ok) throw new TokenStarError(message(body), response.status); return body as T; }
export const tokenstarJsonRequest = <T>(path: string, body?: unknown, method = "POST") => request<T>(path, { method, body: body === undefined ? undefined : JSON.stringify(body) });
export const tokenstarGet = <T>(path: string) => request<T>(path, { method: "GET" });
export const tokenstarFormRequest = <T>(path: string, formData: FormData) => request<T>(path, { method: "POST", body: formData });
