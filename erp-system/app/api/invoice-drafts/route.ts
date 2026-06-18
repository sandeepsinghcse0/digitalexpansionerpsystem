import { NextResponse } from "next/server";
import { prisma } from "../../../prisma/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const invoiceDraft = await prisma.invoiceDraft.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!invoiceDraft) {
        return NextResponse.json(
          { success: false, message: "Draft not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, invoiceDraft });
    }

    const drafts = await prisma.invoiceDraft.findMany({
      orderBy: {
        updated_at: "desc",
      },
    });

    return NextResponse.json({ success: true, drafts });
  } catch (error) {
    console.error("Draft fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch invoice drafts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Tenant not found" },
        { status: 500 }
      );
    }

    const draftData = {
      tenant_id: tenant.id,
      invoice_number: body.invoiceNumber || String(Math.floor(100000 + Math.random() * 900000)),
      invoice_date: body.invoiceDate ? new Date(body.invoiceDate) : new Date(),
      due_date: body.dueDate ? new Date(body.dueDate) : null,
      status: (body.status || "DRAFT").toUpperCase(),
      penalty_amount: Number(body.penaltyAmount || 0),
      subtotal: Number(body.subtotal || 0),
      tax_amount: Number(body.taxAmount || 0),
      total_amount: Number(body.totalAmount || 0),
      notes: body.notes || null,
      terms: body.terms || null,
      seller_details: body.sellerDetails || {},
      customer_details: body.customerDetails || {},
      items: body.items || [],
      created_by: 1,
    };

    let draft;
    if (body.id) {
      draft = await prisma.invoiceDraft.update({
        where: { id: Number(body.id) },
        data: draftData,
      });
    } else {
      draft = await prisma.invoiceDraft.create({ data: draftData });
    }

    return NextResponse.json({ success: true, draft });
  } catch (error) {
    console.error("Draft save error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save invoice draft" },
      { status: 500 }
    );
  }
}
