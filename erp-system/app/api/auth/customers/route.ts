import { prisma } from "../../../../prisma/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const tenant =
      (await prisma.tenant.findFirst()) ||
      (await prisma.tenant.create({
        data: {
          business_name: "Default Tenant",
          email: `tenant-${Date.now()}@example.com`,
        },
      }));

    const customer = await prisma.customer.create({
  data: {
    tenant_id: 1, // replace with logged-in tenant later

    name: body.name,

    email: body.email || null,

    phone: body.phone || null,

    gst_number: body.gstNumber || null,

    status: body.status || "ACTIVE",
  },
});

    return NextResponse.json(customer);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error creating customer" },
      { status: 500 }
    );
  }
}