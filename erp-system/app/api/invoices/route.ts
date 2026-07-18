import { NextResponse } from "next/server";
import { prisma } from "../../../prisma/lib/prisma";

const normalizeInvoice = (invoice: any) => ({
  id: invoice.id,
  invoice_number: invoice.invoice_number,
  invoice_date: invoice.invoice_date,
  due_date: invoice.due_date,
  status: invoice.status,
  subtotal: invoice.subtotal,
  tax_amount: invoice.tax_amount,
  total_amount: invoice.total_amount,
  penalty_amount: invoice.penalty_amount,
  notes: invoice.notes,
  terms: invoice.terms,
  customer: invoice.customer ? { name: invoice.customer.name } : null,
  customer_profile: invoice.customer_profile
    ? {
        customer_name: invoice.customer_profile.customer_name,
        company_name: invoice.customer_profile.company_name,
        email: invoice.customer_profile.email,
        phone: invoice.customer_profile.phone,
        gst_number: invoice.customer_profile.gst_number,
        address: invoice.customer_profile.address,
        city: invoice.customer_profile.city,
        state: invoice.customer_profile.state,
        postal_code: invoice.customer_profile.postal_code,
      }
    : null,
  seller_profile: invoice.seller_profile
    ? {
        business_name: invoice.seller_profile.business_name,
        contact_name: invoice.seller_profile.contact_name,
        email: invoice.seller_profile.email,
        phone: invoice.seller_profile.phone,
        gst_number: invoice.seller_profile.gst_number,
        pan_number: invoice.seller_profile.pan_number,
        address: invoice.seller_profile.address,
        city: invoice.seller_profile.city,
        state: invoice.seller_profile.state,
        postal_code: invoice.seller_profile.postal_code,
      }
    : null,
  invoiceitem: (invoice.invoiceitem || []).map((item: any) => ({
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal,
    tax_amount: item.tax_amount,
    total_amount: item.total_amount,
    product: item.product ? { name: item.product.name } : null,
    gstrate: item.gstrate ? { percentage: item.gstrate.percentage } : null,
  })),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("id");

    if (invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: Number(invoiceId) },
        include: {
          customer: true,
          seller_profile: true,
          customer_profile: true,
          invoiceitem: {
            include: {
              product: true,
              gstrate: true,
            },
          },
        },
      });

      if (!invoice) {
        return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, invoice: normalizeInvoice(invoice) });
    }

    const tenant = await prisma.tenant.findFirst();

    if (!tenant) {
      return NextResponse.json({ success: true, invoices: [] });
    }

    const invoices = await prisma.invoice.findMany({
      where: { tenant_id: tenant.id },
      include: {
        customer: true,
        seller_profile: true,
        customer_profile: true,
        invoiceitem: {
          include: {
            product: true,
            gstrate: true,
          },
        },
      },
      orderBy: [{ created_at: "desc" }],
    });

    return NextResponse.json({
      success: true,
      invoices: invoices.map(normalizeInvoice),
    });
  } catch (error: any) {
    console.error("========== GET INVOICES ERROR ==========");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load invoices",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const invoiceId = Number(body.id);

    if (!invoiceId) {
      return NextResponse.json({ success: false, message: "Invoice id is required" }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        seller_profile: true,
        customer_profile: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
    }

    const tenantId = invoice.tenant_id;
    const invoiceNumber = body.invoiceNumber || invoice.invoice_number;

    if (body.sellerDetails) {
      if (invoice.seller_profile_id) {
        await prisma.sellerProfile.update({
          where: { id: invoice.seller_profile_id },
          data: {
            business_name: body.sellerDetails.businessName || "",
            contact_name: body.sellerDetails.contactName || "",
            email: body.sellerDetails.email || null,
            phone: body.sellerDetails.phone || null,
            gst_number: body.sellerDetails.gstNumber || null,
            pan_number: body.sellerDetails.panNumber || null,
            address: body.sellerDetails.address || null,
            city: body.sellerDetails.city || null,
            state: body.sellerDetails.state || null,
            postal_code: body.sellerDetails.postalCode || null,
          },
        });
      } else {
        const sellerProfile = await prisma.sellerProfile.create({
          data: {
            tenant_id: tenantId,
            business_name: body.sellerDetails.businessName || "",
            contact_name: body.sellerDetails.contactName || "",
            email: body.sellerDetails.email || null,
            phone: body.sellerDetails.phone || null,
            gst_number: body.sellerDetails.gstNumber || null,
            pan_number: body.sellerDetails.panNumber || null,
            address: body.sellerDetails.address || null,
            city: body.sellerDetails.city || null,
            state: body.sellerDetails.state || null,
            postal_code: body.sellerDetails.postalCode || null,
            country: "India",
          },
        });
        await prisma.invoice.update({ where: { id: invoiceId }, data: { seller_profile_id: sellerProfile.id } });
      }
    }

    if (body.customerDetails) {
      if (invoice.customer_profile_id) {
        await prisma.invoiceCustomerProfile.update({
          where: { id: invoice.customer_profile_id },
          data: {
            customer_name: body.customerDetails.customerName || body.customerDetails.companyName || "",
            company_name: body.customerDetails.companyName || null,
            email: body.customerDetails.email || null,
            phone: body.customerDetails.phone || null,
            gst_number: body.customerDetails.gstNumber || null,
            pan_number: body.customerDetails.panNumber || null,
            address: body.customerDetails.address || null,
            city: body.customerDetails.city || null,
            state: body.customerDetails.state || null,
            postal_code: body.customerDetails.postalCode || null,
          },
        });
      } else {
        const customerProfile = await prisma.invoiceCustomerProfile.create({
          data: {
            tenant_id: tenantId,
            customer_name: body.customerDetails.customerName || body.customerDetails.companyName || "",
            company_name: body.customerDetails.companyName || null,
            email: body.customerDetails.email || null,
            phone: body.customerDetails.phone || null,
            gst_number: body.customerDetails.gstNumber || null,
            pan_number: body.customerDetails.panNumber || null,
            address: body.customerDetails.address || null,
            city: body.customerDetails.city || null,
            state: body.customerDetails.state || null,
            postal_code: body.customerDetails.postalCode || null,
            country: "India",
          },
        });
        await prisma.invoice.update({ where: { id: invoiceId }, data: { customer_profile_id: customerProfile.id } });
      }
    }

    await prisma.customer.update({
      where: { id: invoice.customer_id },
      data: {
        name: body.customerDetails?.customerName || body.customerDetails?.companyName || invoice.customer?.name || "Guest Customer",
        email: body.customerDetails?.email || null,
        phone: body.customerDetails?.phone || null,
        gst_number: body.customerDetails?.gstNumber || null,
        updated_at: new Date(),
      },
    });

    const updateData: Record<string, any> = {
      invoice_number: invoiceNumber,
      invoice_date: body.invoiceDate ? new Date(body.invoiceDate) : invoice.invoice_date,
      due_date: body.dueDate ? new Date(body.dueDate) : null,
      status: body.status ? String(body.status).toUpperCase() : invoice.status,
      penalty_amount: body.penaltyAmount !== undefined ? Number(body.penaltyAmount || 0) : invoice.penalty_amount,
      subtotal: body.subtotal !== undefined ? Number(body.subtotal || 0) : invoice.subtotal,
      tax_amount: body.taxAmount !== undefined ? Number(body.taxAmount || 0) : invoice.tax_amount,
      total_amount: body.totalAmount !== undefined ? Number(body.totalAmount || 0) : invoice.total_amount,
      notes: body.notes !== undefined ? body.notes : invoice.notes,
      terms: body.terms !== undefined ? body.terms : invoice.terms,
      updated_at: new Date(),
    };

    if (body.items && Array.isArray(body.items)) {
      await prisma.invoiceitem.deleteMany({ where: { invoice_id: invoiceId } });

      const unit = (await prisma.unitofmeasure.findFirst({ where: { symbol: "PCS" } })) || (await prisma.unitofmeasure.create({ data: { name: "Piece", symbol: "PCS" } }));

      for (const [index, item] of body.items.entries()) {
        const quantity = Number(item.qty || 0);
        const rate = Number(item.rate || 0);
        const subtotalValue = quantity * rate;
        const gstPercent = Number(item.gstRate ?? item.gstPercent ?? 0);
        const taxAmountValue = subtotalValue * (gstPercent / 100);
        const totalAmountValue = subtotalValue + taxAmountValue;

        let gstRate = await prisma.gstrate.findFirst({ where: { tenant_id: tenantId, percentage: gstPercent } });
        if (!gstRate) {
          gstRate = await prisma.gstrate.create({ data: { tenant_id: tenantId, percentage: gstPercent, name: `GST ${gstPercent}%`, updated_at: new Date() } });
        }

        let product = await prisma.product.findFirst({ where: { tenant_id: tenantId, name: item.description || `Product ${index + 1}` } });
        if (!product) {
          product = await prisma.product.create({ data: { tenant_id: tenantId, sku: `SKU-${Date.now()}-${index + 1}`, name: item.description || `Product ${index + 1}`, description: item.description || null, unit_id: unit.id, cost_price: rate, selling_price: rate, gst_rate_id: gstRate.id, quantity_in_stock: 0, updated_at: new Date() } });
        }

        await prisma.invoiceitem.create({
          data: {
            invoice_id: invoiceId,
            product_id: product.id,
            gst_rate_id: gstRate.id,
            quantity,
            unit_price: rate,
            subtotal: subtotalValue,
            tax_amount: taxAmountValue,
            total_amount: totalAmountValue,
            description: item.description || null,
            updated_at: new Date(),
          },
        });
      }
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        customer: true,
        seller_profile: true,
        customer_profile: true,
        invoiceitem: {
          include: {
            product: true,
            gstrate: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, invoice: normalizeInvoice(updatedInvoice) });
  } catch (error: any) {
    console.error("========== PATCH INVOICE ERROR ==========");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to update invoice",
      },
      { status: 500 }
    );
  }
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
          updated_at: new Date(),
        },
      });
    }

    const generateUniqueInvoiceNumber = async () => {
      let invoiceNumber = "";
      let existing = null;
      let attempts = 0;

      do {
        invoiceNumber = String(Math.floor(100000 + Math.random() * 900000));
        existing = await prisma.invoice.findFirst({
          where: {
            tenant_id: tenant.id,
            invoice_number: invoiceNumber,
          },
        });
        attempts += 1;
      } while (existing && attempts < 10);

      if (existing) {
        throw new Error("Unable to generate a unique invoice number. Please try again.");
      }

      return invoiceNumber;
    };

    const invoiceNumber =
      body.invoiceNumber && /^[0-9]{6}$/.test(body.invoiceNumber)
        ? body.invoiceNumber
        : await generateUniqueInvoiceNumber();

    await prisma.sellerProfile.create({
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

    await prisma.invoiceCustomerProfile.create({
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
        invoice_number: invoiceNumber,
        invoice_date: new Date(body.invoiceDate || new Date()),
        due_date: body.dueDate ? new Date(body.dueDate) : null,
        status: (body.status || "DRAFT").toUpperCase(),
        penalty_amount: Number(body.penaltyAmount || 0),
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
      const gstPercent = Number(item.gstRate ?? item.gstPercent ?? 0);
      const taxAmountValue = subtotalValue * (gstPercent / 100);
      const totalAmountValue = subtotalValue + taxAmountValue;

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
          tax_amount: taxAmountValue,
          total_amount: totalAmountValue,
          description: item.description || null,
          updated_at: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      invoice: normalizeInvoice(invoice),
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
