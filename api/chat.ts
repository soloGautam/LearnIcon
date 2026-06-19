export const config = { runtime: "nodejs" };

export default async function handler(req: Request) {
  if (req.method === "GET") {
    return Response.json({
      ok: true,
      route: "/api/chat",
    });
  }

  try {
    const body = await req.json();

    return Response.json({
      success: true,
      received: body,
    });
  } catch (e: any) {
    return Response.json(
      {
        error: e?.message || "unknown",
      },
      {
        status: 500,
      }
    );
  }
}