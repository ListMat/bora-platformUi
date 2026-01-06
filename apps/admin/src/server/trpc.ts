import { initTRPC, TRPCError } from "@trpc/server";
import { prisma } from "@bora/db";
import superjson from "superjson";
import { ZodError } from "zod";

type CreateContextOptions = {
    session: any | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma,
    };
};

export const createTRPCContext = async () => {
    // Para NextAuth v5, a sessão será obtida dentro dos procedures
    return createInnerTRPCContext({
        session: null,
    });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
    // TODO: Implementar autenticação com NextAuth v5
    // Por enquanto, permitir acesso sem autenticação para desenvolvimento
    return next({
        ctx: {
            session: ctx.session,
        },
    });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
