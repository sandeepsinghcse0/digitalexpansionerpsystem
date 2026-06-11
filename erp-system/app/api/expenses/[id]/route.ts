import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.expense.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({
    success: true,
  });
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await request.json();

  const categoryRecord =
    await prisma.expenseCategory.findFirst({
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
    },
  });

  return NextResponse.json(expense);
}