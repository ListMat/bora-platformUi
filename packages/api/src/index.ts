import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { lessonRouter } from "./routers/lesson";
import { instructorRouter } from "./routers/instructor";
import { paymentRouter } from "./routers/payment";
import { ratingRouter } from "./routers/rating";
import { emergencyRouter } from "./routers/emergency";
import { bundleRouter } from "./routers/bundle";
import { chatRouter } from "./routers/chat";
import { skillRouter } from "./routers/skill";
import { vehicleRouter } from "./routers/vehicle";

export const appRouter = router({
  user: userRouter,
  lesson: lessonRouter,
  instructor: instructorRouter,
  payment: paymentRouter,
  rating: ratingRouter,
  emergency: emergencyRouter,
  bundle: bundleRouter,
  chat: chatRouter,
  skill: skillRouter,
  vehicle: vehicleRouter,
});

export type AppRouter = typeof appRouter;

export * from "./trpc";
export { prisma } from "@bora/db";

