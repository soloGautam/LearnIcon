export const config = { runtime: "nodejs" };

export default async function handler(req: Request) {
  console.log("STEP 1");

  try {
    console.log("STEP 2");

    const body = await req.json();

    console.log("STEP 3");
    console.log(JSON.stringify(body).slice(0, 200));

    return Response.json({
      success: true,
      received: true,
    });
  } catch (e: any) {
    console.error("ERROR", e);

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
