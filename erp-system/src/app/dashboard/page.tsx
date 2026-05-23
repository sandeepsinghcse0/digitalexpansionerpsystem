import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        ERP Dashboard
      </h1>

      <p>
        Welcome {session.user.name}
      </p>

      <p>
        Role: {session.user.role}
      </p>
    </div>
  );
}