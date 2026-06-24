import { prisma } from "../../../prisma/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await (prisma as any).inventory.findMany({
      include: {
        product: {
          include: {
            productcategory: true,
            supplier: true,
            unitofmeasure: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const mappedProducts = products.map((item: any) => ({
      ...item,
      product: {
        ...item.product,
        category: item.product.productcategory,
      },
    }));

    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to load inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sku,
      name,
      description,
      category_id,
      supplier_id,
      unit_id,
      cost_price,
      selling_price,
      quantity_in_stock,
      reorder_level,
      gst_rate_id,
      status,
      custom_category,
    } = body;

    // Server-side validation
    if (!sku || !name || !unit_id || cost_price === undefined || selling_price === undefined || !gst_rate_id) {
      return NextResponse.json(
        { error: "SKU, Name, Unit, Cost Price, Selling Price, and GST Rate are required fields." },
        { status: 400 }
      );
    }

    if (Number(cost_price) <= 0) {
      return NextResponse.json(
        { error: "Cost price must be greater than 0." },
        { status: 400 }
      );
    }

    if (Number(selling_price) <= 0) {
      return NextResponse.json(
        { error: "Selling price must be greater than 0." },
        { status: 400 }
      );
    }

    // Get the active tenant
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          business_name: "Default Tenant",
          email: "default@local",
          updated_at: new Date(),
        },
      });
    }

    const tenantId = tenant.id;

    // Check if SKU exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        tenant_id: tenantId,
        sku: sku.trim(),
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: `A product with SKU "${sku}" already exists.` },
        { status: 400 }
      );
    }

    // Create product and corresponding inventory record in a transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      let finalCategoryId = (category_id && category_id !== "other") ? Number(category_id) : null;

      // Handle custom category
      if (custom_category && (category_id === "other" || !finalCategoryId || isNaN(finalCategoryId))) {
        const catName = custom_category.trim();
        let category = await tx.productcategory.findFirst({
          where: {
            tenant_id: tenantId,
            name: catName,
          },
        });
        if (!category) {
          category = await tx.productcategory.create({
            data: {
              tenant_id: tenantId,
              name: catName,
              updated_at: new Date(),
            },
          });
        }
        finalCategoryId = category.id;
      }

      const prod = await tx.product.create({
        data: {
          tenant_id: tenantId,
          sku: sku.trim(),
          name: name.trim(),
          description: description ? description.trim() : null,
          category_id: finalCategoryId,
          supplier_id: supplier_id ? Number(supplier_id) : null,
          unit_id: Number(unit_id),
          cost_price: Number(cost_price),
          selling_price: Number(selling_price),
          quantity_in_stock: Number(quantity_in_stock || 0),
          reorder_level: Number(reorder_level || 0),
          gst_rate_id: Number(gst_rate_id),
          status: status || "ACTIVE",
          updated_at: new Date(),
        },
      });

      await tx.inventory.create({
        data: {
          tenant_id: tenantId,
          product_id: prod.id,
          quantity_available: Number(quantity_in_stock || 0),
          quantity_reserved: 0,
          quantity_damaged: 0,
          updated_at: new Date(),
        },
      });

      return prod;
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}