import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  const productId = Number(id);
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { selling_price, status, quantity_available } = body;

    // Use transaction to update both product and inventory
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Update product details (selling_price and status) if provided
      const prodUpdateData: any = {};
      if (selling_price !== undefined) {
        prodUpdateData.selling_price = Number(selling_price);
      }
      if (status !== undefined) {
        prodUpdateData.status = status;
      }
      prodUpdateData.updated_at = new Date();

      const updatedProd = await tx.product.update({
        where: { id: productId },
        data: prodUpdateData,
      });

      // 2. Update inventory quantity_available if provided
      if (quantity_available !== undefined) {
        // Find if inventory record exists
        const inv = await tx.inventory.findFirst({
          where: { product_id: productId },
        });

        if (inv) {
          await tx.inventory.update({
            where: { id: inv.id },
            data: {
              quantity_available: Number(quantity_available),
              updated_at: new Date(),
            },
          });
        } else {
          // If inventory record doesn't exist for some reason, create it
          let tenant = await tx.tenant.findFirst();
          const tenantId = tenant ? tenant.id : 1;
          await tx.inventory.create({
            data: {
              tenant_id: tenantId,
              product_id: productId,
              quantity_available: Number(quantity_available),
              quantity_reserved: 0,
              quantity_damaged: 0,
              updated_at: new Date(),
            },
          });
        }
      }

      return updatedProd;
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("Error updating product/inventory:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}
