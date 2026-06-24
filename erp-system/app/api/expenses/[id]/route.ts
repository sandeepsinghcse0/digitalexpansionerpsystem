import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing expense id" },
      { status: 400 }
    );
  }

  const expenseId = Number(id);
  if (Number.isNaN(expenseId)) {
    return NextResponse.json(
      { error: "Invalid expense id" },
      { status: 400 }
    );
  }

  await prisma.expense.delete({
    where: {
      id: expenseId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing expense id" },
      { status: 400 }
    );
  }

  const body = await request.json();

  const categoryRecord =
    await prisma.expensecategory.findFirst({
      where: {
        name: body.category,
      },
    });

  if (!categoryRecord) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 400 }
    );
  }

  const expense = await prisma.expense.update({
    where: {
      id: Number(id),
    },
    data: {
      description: body.description,
      amount: Number(body.amount),
      expense_date: new Date(body.date),
      notes: body.notes || null,
      category_id: categoryRecord.id,
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
}