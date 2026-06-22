import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plan } = req.body;

  const variants: Record<string, string | undefined> = {
    builder: process.env.LEMON_BUILDER_VARIANT_ID,
    pro: process.env.LEMON_PRO_VARIANT_ID,
    titan: process.env.LEMON_TITAN_VARIANT_ID,
  };

  const variantId = variants[plan];

  if (!variantId) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {},
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_SQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId,
            },
          },
        },
      },
    }),
  });

  const json = await response.json();

  return res.status(200).json({
    url: json.data.attributes.url,
  });
}