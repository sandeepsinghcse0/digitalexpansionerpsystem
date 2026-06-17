import { prisma } from "../../../../prisma/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Get or create default tenant if not exists (should exist)
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          business_name: "Default Tenant",
          email: "default@local",
          updated_at: new Date(),
        },
      });
    }

    const tenantId = tenant.id;

    // 2. Fetch or seed categories
    let categories = await prisma.productcategory.findMany({
      where: { tenant_id: tenantId },
      orderBy: { name: "asc" },
    });

    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Electronics", description: "Gadgets and electronic components" },
        { name: "Clothing", description: "Apparel, garments, and accessories" },
        { name: "Grocery", description: "Food products, beverages, and daily items" },
        { name: "Others", description: "Miscellaneous products" },
      ];

      for (const cat of defaultCategories) {
        await prisma.productcategory.create({
          data: {
            tenant_id: tenantId,
            name: cat.name,
            description: cat.description,
            updated_at: new Date(),
          },
        });
      }

      categories = await prisma.productcategory.findMany({
        where: { tenant_id: tenantId },
        orderBy: { name: "asc" },
      });
    }

    // 3. Fetch or seed units of measure
    let units = await prisma.unitofmeasure.findMany({
      orderBy: { symbol: "asc" },
    });

    if (units.length === 0) {
      const defaultUnits = [
        { name: "Piece", symbol: "PCS" },
        { name: "Kilogram", symbol: "KG" },
        { name: "Litre", symbol: "L" },
        { name: "Box", symbol: "BOX" },
        { name: "Meter", symbol: "M" },
      ];

      for (const unit of defaultUnits) {
        await prisma.unitofmeasure.create({
          data: {
            name: unit.name,
            symbol: unit.symbol,
          },
        });
      }

      units = await prisma.unitofmeasure.findMany({
        orderBy: { symbol: "asc" },
      });
    }

    // 4. Fetch or seed GST rates
    let gstRates = await prisma.gstrate.findMany({
      where: { tenant_id: tenantId },
      orderBy: { percentage: "asc" },
    });

    if (gstRates.length === 0) {
      const defaultRates = [
        { name: "GST 0%", percentage: 0 },
        { name: "GST 5%", percentage: 5 },
        { name: "GST 12%", percentage: 12 },
        { name: "GST 18%", percentage: 18 },
        { name: "GST 28%", percentage: 28 },
      ];

      for (const rate of defaultRates) {
        await prisma.gstrate.create({
          data: {
            tenant_id: tenantId,
            percentage: rate.percentage,
            name: rate.name,
            updated_at: new Date(),
          },
        });
      }

      gstRates = await prisma.gstrate.findMany({
        where: { tenant_id: tenantId },
        orderBy: { percentage: "asc" },
      });
    }

    // 5. Fetch suppliers
    const suppliers = await prisma.supplier.findMany({
      where: { tenant_id: tenantId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      categories,
      units,
      gstRates,
      suppliers,
    });
  } catch (error) {
    console.error("Error loading inventory metadata:", error);
    return NextResponse.json(
      { error: "Failed to load product creation metadata" },
      { status: 500 }
    );
  }
}
