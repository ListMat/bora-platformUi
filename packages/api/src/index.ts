import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { lessonRouter } from "./routers/lesson";
import { instructorRouter } from "./routers/instructor";
import { studentRouter } from "./routers/student";
import { paymentRouter } from "./routers/payment";
import { ratingRouter } from "./routers/rating";
import { emergencyRouter } from "./routers/emergency";
import { bundleRouter } from "./routers/bundle";
import { chatRouter } from "./routers/chat";
import { skillRouter } from "./routers/skill";
import { vehicleRouter } from "./routers/vehicle";
import { planRouter } from "./routers/plan";
import { notificationRouter } from "./routers/notification";
import { adminRouter } from "./routers/admin";
import { availabilityRouter } from "./routers/availability";

export const appRouter = router({
  user: userRouter,
  lesson: lessonRouter,
  instructor: instructorRouter,
  student: studentRouter,
  payment: paymentRouter,
  rating: ratingRouter,
  emergency: emergencyRouter,
  bundle: bundleRouter,
  chat: chatRouter,
  skill: skillRouter,
  vehicle: vehicleRouter,
  plan: planRouter,
  notification: notificationRouter,
  admin: adminRouter,
  availability: availabilityRouter,
});

export type AppRouter = typeof appRouter;

export * from "./trpc";
export { prisma } from "@bora/db";

