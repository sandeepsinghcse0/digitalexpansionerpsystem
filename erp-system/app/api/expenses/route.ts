import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        expensecategory: true,
      },
      orderBy: {
        expense_date: "desc",
      },
    });

    const mappedExpenses = expenses.map((expense: any) => ({
      ...expense,
      category: expense.expensecategory,
    }));

    return NextResponse.json(mappedExpenses);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("POST BODY:", body);

    let categoryRecord =
      await prisma.expensecategory.findFirst({
        where: {
          name: body.category,
        },
      });

    // Ensure a tenant exists (tenant_id is required by schema)
    let tenantRecord = await prisma.tenant.findUnique({ where: { id: 1 } });
    if (!tenantRecord) {
      tenantRecord = await prisma.tenant.create({
        data: {
          business_name: "Default Tenant",
          email: "default@local",
          updated_at: new Date(),
        },
      });
    }

    if (!categoryRecord) {
      categoryRecord = await prisma.expensecategory.create({
        data: {
          tenant_id: tenantRecord.id,
          name: body.category || "Others",
          description: body.category
            ? `${body.category} expenses`
            : "Auto-created category",
        },
      });
    }

    const expense = await prisma.expense.create({
      data: {
        tenant_id: tenantRecord.id,
        category_id: categoryRecord.id,
        description: body.description,
        amount: Number(body.amount),
        expense_date: new Date(body.date),
        created_by: 1,
        notes: body.notes || null,
        updated_at: new Date(),
      },
      include: {
        expensecategory: true,
      },
    });

    const mappedExpense = {
      ...expense,
      category: (expense as any).expensecategory,
    };

    return NextResponse.json(mappedExpense);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}