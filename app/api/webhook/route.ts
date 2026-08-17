import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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

  const body = await req.text();
  const stripe = new Stripe(stripeKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  // Retrieve the full session so all fields (including shipping_details) are present.
  const session = await stripe.checkout.sessions.retrieve(
    (event.data.object as Stripe.Checkout.Session).id,
    { expand: ["shipping_details"] }
  );

  const { printSlug, printName, size, sku, printFileUrl } = session.metadata ?? {};
  // shipping_details is populated when shipping_address_collection is set on the session.
  const shipping = (session as unknown as { shipping_details?: { name?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } }).shipping_details;
  const customerEmail = session.customer_details?.email;

  if (!sku || !printFileUrl || !shipping?.address) {
    console.error("[webhook] Missing metadata or shipping address", { printSlug, sku, shipping });
    return NextResponse.json({ error: "Incomplete order data" }, { status: 400 });
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
        line1: addr.line1 ?? "",
        line2: addr.line2 ?? undefined,
        postalOrZipCode: addr.postal_code ?? "",
        countryCode: addr.country ?? "",
        townOrCity: addr.city ?? "",
        stateOrCounty: addr.state ?? undefined,
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

  const prodigiRes = await fetch(`${prodigiUrl}/orders`, {
    method: "POST",
    headers: {
      "X-API-Key": prodigiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prodigiOrder),
  });

  if (!prodigiRes.ok) {
    const detail = await prodigiRes.text();
    console.error("[webhook] Prodigi order failed:", prodigiRes.status, detail);
    // Return 200 so Stripe doesn't retry — log the failure for manual follow-up.
    return NextResponse.json({ received: true, prodigiError: detail });
  }

  const prodigiData = await prodigiRes.json();
  console.log("[webhook] Prodigi order created:", prodigiData?.order?.id ?? prodigiData);

  return NextResponse.json({ received: true });
}
