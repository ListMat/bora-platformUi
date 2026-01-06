import { createTRPCRouter } from "./trpc";
import { instructorRouter } from "./routers/instructor";
import { authRouter } from "./routers/auth";
import { lessonRouter } from "./routers/lesson";
import { complaintRouter } from "./routers/complaint";

export const appRouter = createTRPCRouter({
    instructor: instructorRouter,
    auth: authRouter,
    lesson: lessonRouter,
    complaint: complaintRouter,
});

export type AppRouter = typeof appRouter;
