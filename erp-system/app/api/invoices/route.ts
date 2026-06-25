import { NextResponse } from "next/server";
import { prisma } from "../../../prisma/lib/prisma";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Invoices API working",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("========== PRISMA DEBUG ==========");
    console.log("PRISMA:", prisma);
    console.log("PRISMA KEYS:", Object.keys(prisma as any));
    console.log("TENANT:", (prisma as any).tenant);

    let tenant = await prisma.tenant.findFirst();

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          business_name:
            body.sellerDetails?.businessName ||
            body.customerDetails?.companyName ||
            "",
          email:
            body.sellerDetails?.email ||
            `tenant-${Date.now()}@local`,
          updated_at: new Date(),
        },
      });
    }

    // rest of your code...

    const customerRecord = await prisma.customer.create({
      data: {
        tenant_id: tenant.id,
        name:
          body.customerDetails?.customerName ||
          body.customerDetails?.companyName ||
          "Guest Customer",
        email: body.customerDetails?.email || null,
        phone: body.customerDetails?.phone || null,
        gst_number: body.customerDetails?.gstNumber || null,
        status: "ACTIVE",
        updated_at: new Date(),
      },
    });

    const creator = await prisma.user.findFirst();

    const invoice = await prisma.invoice.create({
      data: {
        tenant_id: tenant.id,
        customer_id: customerRecord.id,
        invoice_number: body.invoiceNumber || `INV-${Date.now()}`,
        invoice_date: new Date(body.invoiceDate || new Date()),
        due_date: body.dueDate ? new Date(body.dueDate) : null,
        status: (body.status || "DRAFT").toUpperCase(),
        subtotal: Number(body.subtotal || 0),
        tax_amount: Number(body.taxAmount || 0),
        total_amount: Number(body.totalAmount || 0),
        notes: body.notes || null,
        terms: body.terms || null,
        created_by: creator?.id ?? 1,
        updated_at: new Date(),
      },
    });

    const unit =
      (await prisma.unitofmeasure.findFirst({ where: { symbol: "PCS" } })) ||
      (await prisma.unitofmeasure.create({
        data: {
          name: "Piece",
          symbol: "PCS",
        },
      }));

    for (const [index, item] of (body.items || []).entries()) {
      const quantity = Number(item.qty || 0);
      const rate = Number(item.rate || 0);
      const subtotalValue = quantity * rate;
      const gstPercent = Number(item.gstPercent || 0);

      let gstRate = await prisma.gstrate.findFirst({
        where: {
          tenant_id: tenant.id,
          percentage: gstPercent,
        },
      });

      if (!gstRate) {
        gstRate = await prisma.gstrate.create({
          data: {
            tenant_id: tenant.id,
            percentage: gstPercent,
            name: `GST ${gstPercent}%`,
            updated_at: new Date(),
          },
        });
      }

      let product = await prisma.product.findFirst({
        where: {
          tenant_id: tenant.id,
          name: item.description || `Product ${index + 1}`,
        },
      });

      if (!product) {
        product = await prisma.product.create({
          data: {
            tenant_id: tenant.id,
            sku: `SKU-${Date.now()}-${index + 1}`,
            name: item.description || `Product ${index + 1}`,
            description: item.description || null,
            unit_id: unit.id,
            cost_price: rate,
            selling_price: rate,
            gst_rate_id: gstRate.id,
            quantity_in_stock: 0,
            updated_at: new Date(),
          },
        });
      }

      await prisma.invoiceitem.create({
        data: {
          invoice_id: invoice.id,
          product_id: product.id,
          gst_rate_id: gstRate.id,
          quantity,
          unit_price: rate,
          subtotal: subtotalValue,
          tax_amount: 0,
          total_amount: subtotalValue,
          description: item.description || null,
          updated_at: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error: any) {
  console.error("========== INVOICE ERROR ==========");
  console.error(error);
  console.error("MESSAGE:", error?.message);
  console.error("STACK:", error?.stack);

  return NextResponse.json(
    {
      success: false,
      message: error?.message || "Failed to create invoice",
    },
    { status: 500 }
  );
}
}
