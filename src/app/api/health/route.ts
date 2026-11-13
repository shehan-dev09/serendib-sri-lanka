import { checkStorage, storageKind } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await checkStorage();
    return Response.json({ ok: true, storage: storageKind });
  } catch {
    return Response.json({ ok: false, storage: storageKind }, { status: 500 });
  }
}
