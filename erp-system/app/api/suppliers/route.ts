import { NextResponse } from "next/server";
import { prisma } from "../../../prisma/lib/prisma";

export async function GET() {
  try {
  const sellers = await prisma.supplier.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(sellers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}