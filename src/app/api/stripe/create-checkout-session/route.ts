import { NextResponse } from "next/server";
import Stripe from "stripe";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, tier } = body;

    if (!email || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let userId = "mock-123";
    if (process.env.MOCK_ENV !== 'true') {
      await connectDB();
      const user = await User.findOne({ email });

      if (!user) {
        return NextResponse.json({ error: "User not found. Please register first." }, { status: 404 });
      }
      userId = user._id.toString();
    }

    let priceAmount = 5999;
    let productName = "16London Trend Algo";
    
    if (tier === "2") {
      priceAmount = 8999;
      productName = "Trend Algo + London X";
    } else if (tier === "3") {
      priceAmount = 11999;
      productName = "16London Complete System";
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
            },
            unit_amount: priceAmount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?tier=${tier}`,
      metadata: {
        userId: userId,
        tier: tier,
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
