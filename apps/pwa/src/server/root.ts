import { createTRPCRouter } from "./trpc";
import { instructorRouter } from "./routers/instructor";
import { authRouter } from "./routers/auth";
import { lessonRouter } from "./routers/lesson";
import { complaintRouter } from "./routers/complaint";
import { vehicleRouter } from "./routers/vehicle";

export const appRouter = createTRPCRouter({
    instructor: instructorRouter,
    auth: authRouter,
    lesson: lessonRouter,
    complaint: complaintRouter,
    vehicle: vehicleRouter,
});

export type AppRouter = typeof appRouter;
