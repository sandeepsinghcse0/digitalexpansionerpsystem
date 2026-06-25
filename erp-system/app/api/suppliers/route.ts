import { NextResponse } from "next/server";
import { prisma } from "../../../prisma/lib/prisma";

export async function GET() {
  try {
  const sellers = await prisma.supplier.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(sellers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic server-side validation
    if (!body.name) {
      return NextResponse.json({ error: "Supplier name is required!" }, { status: 400 });
    }

    const supplier = await prisma.supplier.create({
      data: {
        tenant_id: body.tenant_id || 1,
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        gst_number: body.gst_number || null,
        pan_number: body.pan_number || null,
        payment_terms: body.payment_terms || null,
        status: body.status || "ACTIVE",
        updated_at: new Date(),
      },
    });

    return NextResponse.json(supplier);
  } catch (error: any) {
    console.error("Supplier creation error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A supplier with this email is already registered." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create supplier" },
      { status: 500 }
    );
  }
}