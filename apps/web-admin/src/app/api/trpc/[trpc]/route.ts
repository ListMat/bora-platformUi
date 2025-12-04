import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@bora/api";
import { prisma } from "@bora/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@bora/auth";
import type { NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      session,
      prisma,
    }),
  });
};

export { handler as GET, handler as POST };

