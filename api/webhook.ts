import crypto from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

const secret = process.env.LEMON_WEBHOOK_SECRET;

if (!secret) {
  return res.status(500).send("Webhook secret missing");
} 

  console.log("Lemon Squeezy Webhook");

  console.log(req.body);

  return res.status(200).send("OK");
}