import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrintBySlug } from "@/lib/queries";

const SIZE_CONFIG = {
  a4: { label: "A4 (21 × 29.7 cm)", priceGBP: 2000, sku: "GLOBAL-PAP-A4" },
  a3: { label: "A3 (29.7 × 42 cm)", priceGBP: 2800, sku: "GLOBAL-PAP-A3" },
  a2: { label: "A2 (42 × 59.4 cm)", priceGBP: 3500, sku: "GLOBAL-PAP-A2" },
} as const;

type SizeKey = keyof typeof SIZE_CONFIG;

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  let printSlug: string;
  let size: SizeKey;
  try {
    ({ printSlug, size } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!printSlug || !size || !(size in SIZE_CONFIG)) {
    return NextResponse.json({ error: "Missing or invalid printSlug / size" }, { status: 400 });
  }

  const print = await getPrintBySlug(printSlug);
  if (!print) {
    return NextResponse.json({ error: "Print not found" }, { status: 404 });
  }
  if (!print.printFileUrl) {
    return NextResponse.json({ error: "Print file URL not configured" }, { status: 500 });
  }

  const sizeConfig = SIZE_CONFIG[size];
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://flatwhiteframes.blog").replace(/\/$/, "");
  const stripe = new Stripe(stripeKey);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: sizeConfig.priceGBP,
          product_data: {
            name: print.name,
            description: `Fine art giclée print — ${sizeConfig.label}`,
          },
        },
        quantity: 1,
      },
    ],
    shipping_address_collection: {
      allowed_countries: [
        "GB", "US", "CA", "AU", "NZ", "DE", "FR", "IT", "ES", "NL",
        "BE", "AT", "CH", "SE", "NO", "DK", "FI", "IE", "PT", "PL",
      ],
    },
    metadata: {
      printSlug,
      printName: print.name,
      size,
      sku: sizeConfig.sku,
      printFileUrl: print.printFileUrl,
    },
    success_url: `${baseUrl}/prints/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/prints/${printSlug}`,
  });

  return NextResponse.json({ url: session.url });
}
