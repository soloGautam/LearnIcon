export default async function handler(req: any, res: any) {
  try {
    res.status(200).json({
      ok: true,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    });
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}