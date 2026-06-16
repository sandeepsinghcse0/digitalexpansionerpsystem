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

    let tenant = await prisma.tenant.findFirst();

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          business_name: body.sellerDetails?.businessName || body.customerDetails?.companyName || "",
          email: body.sellerDetails?.email || `tenant-${Date.now()}@local`,
        },
      });
    }

    const sellerProfile = await prisma.sellerProfile.create({
      data: {
        tenant_id: tenant.id,
        business_name: body.sellerDetails?.businessName || "",
        contact_name: body.sellerDetails?.contactName || "",
        email: body.sellerDetails?.email || null,
        phone: body.sellerDetails?.phone || null,
        gst_number: body.sellerDetails?.gstNumber || null,
        pan_number: body.sellerDetails?.panNumber || null,
        address: body.sellerDetails?.address || null,
        city: body.sellerDetails?.city || null,
        state: body.sellerDetails?.state || null,
        postal_code: body.sellerDetails?.postalCode || null,
        country: body.sellerDetails?.country || "India",
        bank_account: body.sellerDetails?.bankAccount || null,
        ifsc_code: body.sellerDetails?.ifscCode || null,
      },
    });

    const customerProfile = await prisma.invoiceCustomerProfile.create({
      data: {
        tenant_id: tenant.id,
        customer_name: body.customerDetails?.customerName || "",
        company_name: body.customerDetails?.companyName || null,
        email: body.customerDetails?.email || null,
        phone: body.customerDetails?.phone || null,
        gst_number: body.customerDetails?.gstNumber || null,
        pan_number: body.customerDetails?.panNumber || null,
        address: body.customerDetails?.address || null,
        city: body.customerDetails?.city || null,
        state: body.customerDetails?.state || null,
        postal_code: body.customerDetails?.postalCode || null,
        country: body.customerDetails?.country || "India",
      },
    });

    const customerRecord = await prisma.customer.create({
      data: {
        tenant_id: tenant.id,
        name: body.customerDetails?.customerName || "",
        email: body.customerDetails?.email || null,
        phone: body.customerDetails?.phone || null,
        gst_number: body.customerDetails?.gstNumber || null,
        status: "ACTIVE",
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
        seller_profile_id: sellerProfile.id,
        customer_profile_id: customerProfile.id,
      },
    });

    const unit =
      (await prisma.unitOfMeasure.findFirst({ where: { symbol: "PCS" } })) ||
      (await prisma.unitOfMeasure.create({
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

      let gstRate = await prisma.gstRate.findFirst({
        where: {
          tenant_id: tenant.id,
          percentage: gstPercent,
        },
      });

      if (!gstRate) {
        gstRate = await prisma.gstRate.create({
          data: {
            tenant_id: tenant.id,
            percentage: gstPercent,
            name: `GST ${gstPercent}%`,
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
          },
        });
      }

      await prisma.invoiceItem.create({
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
        },
      });
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Invoice create error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create invoice",
      },
      { status: 500 }
    );
  }
}
