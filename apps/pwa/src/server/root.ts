import { createTRPCRouter } from "./trpc";
import { instructorRouter } from "./routers/instructor";
import { authRouter } from "./routers/auth";
import { lessonRouter } from "./routers/lesson";
import { complaintRouter } from "./routers/complaint";
import { vehicleRouter } from "./routers/vehicle";
import { adminRouter } from "./routers/admin";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
    instructor: instructorRouter,
    auth: authRouter,
    lesson: lessonRouter,
    complaint: complaintRouter,
    vehicle: vehicleRouter,
    admin: adminRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
