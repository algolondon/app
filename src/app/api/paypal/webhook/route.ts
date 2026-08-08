import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const eventType = payload.event_type;
    const resource = payload.resource;

    console.log(`[PayPal Webhook] Received Event: ${eventType}`, JSON.stringify(payload));

    if (!resource || !resource.id) {
      return NextResponse.json({ error: "Invalid webhook payload structure" }, { status: 400 });
    }

    const subscriptionId = resource.id; // Starts with I-
    const email = resource.subscriber?.email_address;

    await connectToDatabase();

    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      console.log(`[PayPal Webhook] Activating subscription ${subscriptionId} for email: ${email}`);
      
      // Update by email or subscription ID
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
      
      // Update by subscription ID or email
      const query = email ? { $or: [{ paypalSubscriptionId: subscriptionId }, { email }] } : { paypalSubscriptionId: subscriptionId };
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
