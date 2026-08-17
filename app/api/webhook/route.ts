import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// stripe@22 (API version 2026-07-29.dahlia) moved shipping_details into
// collected_information.shipping_details — it no longer exists at the top level.
interface ShippingAddress {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

interface ShippingDetails {
  name?: string | null;
  address?: ShippingAddress | null;
}

interface CheckoutSession {
  id: string;
  metadata: Record<string, string> | null;
  customer_details: { email?: string | null } | null;
  collected_information: {
    shipping_details?: ShippingDetails | null;
  } | null;
}

// Raw body is required for Stripe signature verification — do not parse as JSON.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    console.error("[webhook] Stripe env vars missing");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // Use a Buffer rather than req.text() — some Vercel edge configurations
  // re-encode the stream before the handler runs, which breaks the HMAC.
  const rawBody = Buffer.from(await req.arrayBuffer());
  const stripe = new Stripe(stripeKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  // Retrieve the full session from the API — the webhook payload is a compact
  // snapshot and may not include shipping_details or all metadata fields.
  const sessionId = (event.data.object as Stripe.Checkout.Session).id;
  const session = await stripe.checkout.sessions.retrieve(sessionId) as unknown as CheckoutSession;

  const { printSlug, size, sku, printFileUrl } = session.metadata ?? {};
  const shipping = session.collected_information?.shipping_details;
  const customerEmail = session.customer_details?.email;

  console.log("[webhook] session fields", {
    sessionId: session.id,
    hasMetadata: !!session.metadata,
    sku,
    printSlug,
    hasShipping: !!shipping,
    hasShippingAddress: !!shipping?.address,
  });

  if (!sku || !printFileUrl || !shipping?.address) {
    // Return 200 so Stripe doesn't retry — this event can't be fulfilled without these fields.
    console.error("[webhook] Missing metadata or shipping address", {
      printSlug,
      sku,
      printFileUrl: !!printFileUrl,
      shipping,
    });
    return NextResponse.json({ received: true, error: "Incomplete order data" });
  }

  const prodigiUrl = process.env.PRODIGI_API_URL?.replace(/\/$/, "");
  const prodigiKey = process.env.PRODIGI_API_KEY;
  if (!prodigiUrl || !prodigiKey) {
    console.error("[webhook] Prodigi env vars missing");
    return NextResponse.json({ error: "Prodigi not configured" }, { status: 500 });
  }

  const addr = shipping.address;
  const prodigiOrder = {
    merchantReference: session.id,
    shippingMethod: "Standard",
    recipient: {
      name: shipping.name ?? customerEmail ?? "Customer",
      email: customerEmail ?? undefined,
      address: {
        line1: addr?.line1 ?? "",
        line2: addr?.line2 ?? undefined,
        postalOrZipCode: addr?.postal_code ?? "",
        countryCode: addr?.country ?? "",
        townOrCity: addr?.city ?? "",
        stateOrCounty: addr?.state ?? undefined,
      },
    },
    items: [
      {
        merchantReference: `${printSlug}-${size}`,
        sku,
        copies: 1,
        sizing: "fillPrintArea",
        assets: [
          {
            printArea: "default",
            url: printFileUrl,
          },
        ],
      },
    ],
  };

  console.log("[prodigi] sending order payload:", JSON.stringify(prodigiOrder, null, 2));

  let prodigiRes: Response;
  try {
    prodigiRes = await fetch(`${prodigiUrl}/orders`, {
      method: "POST",
      headers: {
        "X-API-Key": prodigiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prodigiOrder),
    });
  } catch (err) {
    console.error("[prodigi] fetch threw — network or DNS error:", err);
    return NextResponse.json({ received: true, error: "Prodigi fetch failed" });
  }

  const prodigiBody = await prodigiRes.text();
  console.log("[prodigi] response status:", prodigiRes.status);
  console.log("[prodigi] response body:", prodigiBody);

  if (!prodigiRes.ok) {
    console.error("[prodigi] order rejected — status", prodigiRes.status, "body:", prodigiBody);
    // Return 200 so Stripe doesn't retry — log the failure for manual follow-up.
    return NextResponse.json({ received: true, prodigiError: prodigiBody });
  }

  let prodigiData: unknown;
  try {
    prodigiData = JSON.parse(prodigiBody);
  } catch {
    console.error("[prodigi] response was not valid JSON:", prodigiBody);
    return NextResponse.json({ received: true });
  }

  console.log("[prodigi] order created successfully:", JSON.stringify(prodigiData, null, 2));

  return NextResponse.json({ received: true });
}
