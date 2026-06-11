import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        expense_date: "desc",
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
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

    const expense = await prisma.expense.create({
      data: {
        tenant_id: 1,
        category_id: 1,
        description: body.description,
        amount: Number(body.amount),
        expense_date: new Date(body.date),
        created_by: 1,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}