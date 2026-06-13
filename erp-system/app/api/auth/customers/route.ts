import { prisma } from "../../../../prisma/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        city: body.city,
        status: body.status,
        gstNumber: body.gstNumber,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("CREATE ERROR:", error);

    return NextResponse.json(
      {
        message: "Error creating customer",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const customer = await prisma.customer.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        city: body.city,
        status: body.status,
        gstNumber: body.gstNumber,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    return NextResponse.json(
      {
        message: "Error updating customer",
        error: String(error),
      },
      { status: 500 }
    );
  }
}