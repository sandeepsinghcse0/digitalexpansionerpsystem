import { prisma } from "../../../../prisma/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        address: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const mappedCustomers = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email || "",
      phone: c.phone || "",
      gstNumber: c.gst_number || "",
      status: c.status.charAt(0) + c.status.slice(1).toLowerCase(), // e.g. ACTIVE -> Active
      city: c.address?.[0]?.city || "",
    }));

    return NextResponse.json(mappedCustomers);
  } catch (error) {
    console.error("Error fetching customers:", error);
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
          updated_at: new Date(),
        },
      }));

    // Convert frontend title-case status (Active, Inactive, Suspended) to database uppercase status enum
    const dbStatus = (body.status?.toUpperCase() || "ACTIVE") as any;

    const customer = await prisma.customer.create({
      data: {
        tenant_id: tenant.id,
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        gst_number: body.gstNumber || null,
        status: dbStatus,
        updated_at: new Date(),
        address: {
          create: {
            tenant_id: tenant.id,
            street: "Default Street",
            city: body.city || "",
            state: "Default State",
            postal_code: "000000",
            address_type: "BILLING",
            is_primary: true,
          },
        },
      },
      include: {
        address: true,
      },
    });

    const mappedCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      gstNumber: customer.gst_number || "",
      status: customer.status.charAt(0) + customer.status.slice(1).toLowerCase(), // e.g. ACTIVE -> Active
      city: customer.address?.[0]?.city || "",
    };

    return NextResponse.json(mappedCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { message: "Error creating customer" },
      { status: 500 }
    );
  }
}