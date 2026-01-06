import { adminRouter } from "./routers/admin";
import { complaintsRouter } from "./routers/complaints";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    admin: adminRouter,
    complaints: complaintsRouter,
});

export type AppRouter = typeof appRouter;
