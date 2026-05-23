export { auth as middleware } from "@/lib/auth/auth";

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
