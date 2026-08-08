import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Setting } from '@/models/Setting';

// Public endpoint — returns the correct PayPal client ID based on current mode
export async function GET() {
  try {
    await connectToDatabase();
    
    const modeSetting = await Setting.findOne({ key: 'paypalMode' });
    const mode = modeSetting?.value || 'live'; // default to live

    const clientId = mode === 'sandbox'
      ? (process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID || '')
      : (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '');

    const planIds = mode === 'sandbox'
      ? {
          "1": process.env.PAYPAL_SANDBOX_PLAN_ID_1 || '',
          "2": process.env.PAYPAL_SANDBOX_PLAN_ID_2 || '',
          "3": process.env.PAYPAL_SANDBOX_PLAN_ID_3 || '',
        }
      : {
          "1": "P-5EX01767RJ348304XNJ3LHYA",
          "2": "P-2TU154698S017735HNJ3LJQA",
          "3": "P-1RM14190S6572145FNJ3LKIY",
        };

    const discountPlanIds = mode === 'sandbox'
      ? {
          "1": process.env.PAYPAL_SANDBOX_DISCOUNT_PLAN_ID_1 || '',
          "2": process.env.PAYPAL_SANDBOX_DISCOUNT_PLAN_ID_2 || '',
          "3": process.env.PAYPAL_SANDBOX_DISCOUNT_PLAN_ID_3 || '',
        }
      : {
          "1": process.env.PAYPAL_DISCOUNT_PLAN_ID_1 || "P-5EX01767RJ348304XNJ3LHYA",
          "2": process.env.PAYPAL_DISCOUNT_PLAN_ID_2 || "P-2TU154698S017735HNJ3LJQA",
          "3": process.env.PAYPAL_DISCOUNT_PLAN_ID_3 || "P-1RM14190S6572145FNJ3LKIY",
        };

    return NextResponse.json({ mode, clientId, planIds, discountPlanIds });
  } catch (error) {
    // Fallback to live if DB fails
    return NextResponse.json({
      mode: 'live',
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
      planIds: {
        "1": "P-5EX01767RJ348304XNJ3LHYA",
        "2": "P-2TU154698S017735HNJ3LJQA",
        "3": "P-1RM14190S6572145FNJ3LKIY",
      },
      discountPlanIds: {
        "1": process.env.PAYPAL_DISCOUNT_PLAN_ID_1 || "P-5EX01767RJ348304XNJ3LHYA",
        "2": process.env.PAYPAL_DISCOUNT_PLAN_ID_2 || "P-2TU154698S017735HNJ3LJQA",
        "3": process.env.PAYPAL_DISCOUNT_PLAN_ID_3 || "P-1RM14190S6572145FNJ3LKIY",
      }
    });
  }
}
