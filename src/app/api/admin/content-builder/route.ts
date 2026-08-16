import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { SiteContent } from "@/models/SiteContent";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let content = await SiteContent.findOne().lean();
    if (!content) {
      // Create initial default document
      content = await SiteContent.create({});
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error("Failed to fetch site content:", error);
    return NextResponse.json({ error: "Failed to fetch site content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    const updated = await SiteContent.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Instant cache purge for live homepage
    revalidatePath("/");
    revalidatePath("/admin/customizer");

    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error("Failed to save site content:", error);
    return NextResponse.json({ error: "Failed to save site content" }, { status: 500 });
  }
}
