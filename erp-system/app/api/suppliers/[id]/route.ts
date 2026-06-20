import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing supplier ID" },
      { status: 400 }
    );
  }

  const supplierId = Number(id);
  if (Number.isNaN(supplierId)) {
    return NextResponse.json(
      { error: "Invalid supplier ID" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate supplier_status enum values (ACTIVE, INACTIVE, SUSPENDED)
    const validStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updatedSupplier = await prisma.supplier.update({
      where: {
        id: supplierId,
      },
      data: {
        status: status as any,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, supplier: updatedSupplier });
  } catch (error: any) {
    console.error("Error updating supplier status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update supplier" },
      { status: 500 }
    );
  }
}
