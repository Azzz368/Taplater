import { NextResponse } from "next/server";
import { listAssets } from "@/lib/ai/tokenstar/tokenstarAsset";
import { normalizeAIError } from "@/lib/ai/errors";
export async function POST(request: Request) { try { const body = await request.json() as { groupId?: unknown; name?: unknown }; return NextResponse.json({ ok: true, output: await listAssets({ groupId: typeof body.groupId === "string" ? body.groupId : undefined, name: typeof body.name === "string" ? body.name : undefined }) }); } catch (error) { const e = normalizeAIError(error); return NextResponse.json({ ok: false, error: e }, { status: e.status }); } }
