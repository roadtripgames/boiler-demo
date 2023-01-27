import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
    }
  }, [router, status]);

  return <>{children}</>;
}
