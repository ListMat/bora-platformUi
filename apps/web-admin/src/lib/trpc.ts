import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@bora/api";

export const trpc = createTRPCReact<AppRouter>();

