import { createTRPCRouter } from "./trpc";
import { instructorRouter } from "./routers/instructor";
import { authRouter } from "./routers/auth";
import { lessonRouter } from "./routers/lesson";

export const appRouter = createTRPCRouter({
    instructor: instructorRouter,
    auth: authRouter,
    lesson: lessonRouter,
});

export type AppRouter = typeof appRouter;
