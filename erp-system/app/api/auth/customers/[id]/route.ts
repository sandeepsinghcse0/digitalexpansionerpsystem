import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing customer id" },
      { status: 400 }
    );
  }

  const customerId = Number(id);
  if (Number.isNaN(customerId)) {
    return NextResponse.json(
      { error: "Invalid customer id" },
      { status: 400 }
    );
  }

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

    // Update customer in transaction to handle address upsert/update
    const updatedCustomer = await prisma.$transaction(async (tx: any) => {
      // Find primary address
      const primaryAddress = await tx.address.findFirst({
        where: {
          customer_id: customerId,
          is_primary: true,
        },
      });

      if (primaryAddress) {
        await tx.address.update({
          where: { id: primaryAddress.id },
          data: {
            city: body.city || "",
            updated_at: new Date(),
          },
        });
      } else {
        await tx.address.create({
          data: {
            tenant_id: tenant.id,
            customer_id: customerId,
            street: "Default Street",
            city: body.city || "",
            state: "Default State",
            postal_code: "000000",
            address_type: "BILLING",
            is_primary: true,
          },
        });
      }

      return await tx.customer.update({
        where: { id: customerId },
        data: {
          name: body.name,
          email: body.email || null,
          phone: body.phone || null,
          gst_number: body.gstNumber || null,
          status: dbStatus,
          updated_at: new Date(),
        },
        include: {
          address: true,
        },
      });
    });

    const mapped = {
      id: updatedCustomer.id,
      name: updatedCustomer.name,
      email: updatedCustomer.email || "",
      phone: updatedCustomer.phone || "",
      gstNumber: updatedCustomer.gst_number || "",
      status: updatedCustomer.status.charAt(0) + updatedCustomer.status.slice(1).toLowerCase(),
      city: updatedCustomer.address?.[0]?.city || "",
    };

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing customer id" },
      { status: 400 }
    );
  }

  const customerId = Number(id);
  if (Number.isNaN(customerId)) {
    return NextResponse.json(
      { error: "Invalid customer id" },
      { status: 400 }
    );
  }

  try {
    // Delete addresses and payments, check for invoices (restrict)
    await prisma.$transaction(async (tx: any) => {
      const invoiceCount = await tx.invoice.count({
        where: { customer_id: customerId },
      });

      if (invoiceCount > 0) {
        throw new Error("Cannot delete customer with existing invoices");
      }

      await tx.address.deleteMany({
        where: { customer_id: customerId },
      });

      await tx.payment.deleteMany({
        where: { customer_id: customerId },
      });

      await tx.customer.delete({
        where: { id: customerId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete customer" },
      { status: 500 }
    );
  }
}
