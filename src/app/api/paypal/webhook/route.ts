import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

// Helper to get PayPal Access Token
async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  // Use sandbox for development, live for production
  const baseURL = process.env.NODE_ENV === 'production' 
    ? "https://api-m.paypal.com" 
    : "https://api-m.sandbox.paypal.com";

  if (!clientId || !clientSecret) return null;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${baseURL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token || null;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    
    const eventType = payload.event_type;
    const resource = payload.resource;

    console.log(`[PayPal Webhook] Received Event: ${eventType}`, JSON.stringify(payload));

    if (!resource || !resource.id) {
      return NextResponse.json({ error: "Invalid webhook payload structure" }, { status: 400 });
    }

    // Verify Webhook Signature — MANDATORY
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      console.error(`[PayPal Webhook] PAYPAL_WEBHOOK_ID env var is not set. Rejecting request.`);
      return NextResponse.json({ error: "Webhook verification not configured" }, { status: 500 });
    }

    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      console.error(`[PayPal Webhook] Could not get PayPal access token. Rejecting request.`);
      return NextResponse.json({ error: "Webhook verification failed" }, { status: 500 });
    }

    const baseURL = process.env.NODE_ENV === 'production' 
      ? "https://api-m.paypal.com" 
      : "https://api-m.sandbox.paypal.com";

    const verifyResponse = await fetch(`${baseURL}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: req.headers.get("paypal-auth-algo"),
        cert_url: req.headers.get("paypal-cert-url"),
        transmission_id: req.headers.get("paypal-transmission-id"),
        transmission_sig: req.headers.get("paypal-transmission-sig"),
        transmission_time: req.headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: payload,
      }),
    });

    const verifyData = await verifyResponse.json();
    if (verifyData.verification_status !== "SUCCESS") {
      console.error(`[PayPal Webhook] Signature verification failed!`, verifyData);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    console.log(`[PayPal Webhook] Signature verified successfully.`);

    const subscriptionId = resource.id; // Starts with I-
    const email = resource.subscriber?.email_address;

    await connectToDatabase();

    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      console.log(`[PayPal Webhook] Activating subscription ${subscriptionId} for email: ${email}`);
      
      const query = email ? { $or: [{ email }, { paypalSubscriptionId: subscriptionId }] } : { paypalSubscriptionId: subscriptionId };
      const updatedUser = await User.findOneAndUpdate(
        query,
        { active: true, status: "active", paypalSubscriptionId: subscriptionId },
        { new: true }
      );

      if (updatedUser) {
        console.log(`[PayPal Webhook] Successfully activated user: ${updatedUser.email}`);
      } else {
        console.warn(`[PayPal Webhook] User not found for activation matching ${email} / ${subscriptionId}`);
      }
    } 
    else if (
      eventType === "BILLING.SUBSCRIPTION.CANCELLED" || 
      eventType === "BILLING.SUBSCRIPTION.EXPIRED" ||
      eventType === "BILLING.SUBSCRIPTION.SUSPENDED"
    ) {
      console.log(`[PayPal Webhook] Deactivating subscription ${subscriptionId} (Event: ${eventType}) for email: ${email}`);
      
      // Use subscriptionId as primary key to avoid deactivating wrong user
      const query = { paypalSubscriptionId: subscriptionId };
      const updatedUser = await User.findOneAndUpdate(
        query,
        { active: false, status: eventType.split(".").pop()?.toLowerCase() || "cancelled" },
        { new: true }
      );

      if (updatedUser) {
        console.log(`[PayPal Webhook] Successfully deactivated user: ${updatedUser.email}`);
      } else {
        console.warn(`[PayPal Webhook] User not found for cancellation matching ${email} / ${subscriptionId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[PayPal Webhook Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to process webhook" }, { status: 500 });
  }
}
