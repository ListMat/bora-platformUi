import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { lessonRouter } from "./routers/lesson";
import { instructorRouter } from "./routers/instructor";
import { paymentRouter } from "./routers/payment";

export const appRouter = router({
  user: userRouter,
  lesson: lessonRouter,
  instructor: instructorRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;

export * from "./trpc";
export { prisma } from "@bora/db";

