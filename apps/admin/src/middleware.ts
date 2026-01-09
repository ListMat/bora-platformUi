export { auth as middleware } from "@/server/auth";

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - /auth/* (auth pages)
         * - /api/* (API routes)
         * - /_next/* (Next.js internals)
         * - /favicon.ico, /robots.txt (static files)
         */
        "/((?!auth|api|_next/static|_next/image|favicon.ico|robots.txt).*)",
    ],
};
