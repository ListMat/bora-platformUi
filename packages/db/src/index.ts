import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientOptions: any = {
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
};

if (process.env.NODE_ENV === "development") {
  if (process.env.DIRECT_URL) {
    prismaClientOptions.datasources = {
      db: {
        url: process.env.DIRECT_URL,
      },
    };
  } else if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("pgbouncer")) {
    // Patch automático para Supabase/PgBouncer em Transaction Mode
    const url = process.env.DATABASE_URL;
    prismaClientOptions.datasources = {
      db: {
        url: url.includes('?') ? `${url}&pgbouncer=true` : `${url}?pgbouncer=true`
      }
    };
  }
}

export const prisma =
  global.prisma ||
  new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Export all types and enums from Prisma
export * from "@prisma/client";

