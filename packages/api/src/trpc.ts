import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Session } from "next-auth";
import { prisma, UserRole } from "@bora/db";

export interface Context {
  session: Session | null;
  prisma: typeof prisma;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware de autenticação
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

// Middleware de autorização por role
const hasRole = (roles: UserRole[]) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email },
      select: { role: true },
    });

    if (!user || !roles.includes(user.role)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({ ctx });
  });

export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure
  .use(isAuthenticated)
  .use(hasRole([UserRole.ADMIN, UserRole.AUDITOR]));
export const instructorProcedure = t.procedure
  .use(isAuthenticated)
  .use(hasRole([UserRole.INSTRUCTOR]));
export const studentProcedure = t.procedure.use(isAuthenticated).use(hasRole([UserRole.STUDENT]));

