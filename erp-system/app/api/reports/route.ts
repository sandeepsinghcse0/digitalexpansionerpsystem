import { NextResponse } from "next/server";
import { prisma } from "../../../prisma/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany();

    const expenses = await prisma.expense.findMany();

    const customers = await prisma.customer.findMany();

    const inventory = await prisma.inventory.findMany();

    const revenue = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount),
      0
    );

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const profit = revenue - totalExpenses;

    return NextResponse.json({
      revenue,
      expenses: totalExpenses,
      profit,
      invoices: invoices.length,
      customers: customers.length,
      inventory: inventory.length,
      recentInvoices: invoices.slice(0, 5),
    });
  } catch (error) {
    console.error("REPORT API ERROR:", error);

    return NextResponse.json(
      {
        revenue: 0,
        expenses: 0,
        profit: 0,
        invoices: 0,
        customers: 0,
        inventory: 0,
        recentInvoices: [],
      },
      { status: 200 }
    );
  }
}