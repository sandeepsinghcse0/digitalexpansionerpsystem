import { prisma } from "../../../prisma/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await (prisma as any).inventory.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to load inventory" },
      { status: 500 }
    );
  }
}