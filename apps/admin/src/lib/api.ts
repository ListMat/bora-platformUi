import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/root";
import superjson from "superjson";

export const api = createTRPCReact<AppRouter>();

function getBaseUrl() {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3001}`;
}

export function getClientConfig() {
    return {
        transformer: superjson,
        links: [
            loggerLink({
                enabled: (opts) =>
                    process.env.NODE_ENV === "development" ||
                    (opts.direction === "down" && opts.result instanceof Error),
            }),
            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`,
            }),
        ],
    };
}
