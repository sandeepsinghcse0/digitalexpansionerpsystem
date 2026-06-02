import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/inventory/:path*",
    "/invoices/:path*",
    "/expenses/:path*",
    "/reports/:path*",
  ],
};