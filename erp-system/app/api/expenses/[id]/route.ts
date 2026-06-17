import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      include: {
        category: true,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("PUT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}