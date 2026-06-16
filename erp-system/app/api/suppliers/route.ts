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
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}