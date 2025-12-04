"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para o admin baseado no shadcn-admin-kit
    router.push("/admin");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-lg text-muted-foreground">Redirecionando para o painel administrativo...</div>
    </div>
  );
}

