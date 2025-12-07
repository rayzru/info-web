import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

export default async function MyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login?callbackUrl=/my");
  }

  return <>{children}</>;
}
