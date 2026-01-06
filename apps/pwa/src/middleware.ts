import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Logic to redirect if role doesn't match
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Se estiver logado mas tentar acessar área errada
        if (path.startsWith('/instructor') && token?.role !== 'INSTRUCTOR' && token?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/student/dashboard', req.url));
        }

        if (path.startsWith('/student') && token?.role !== 'STUDENT' && token?.role !== 'ADMIN') {
            // Se for instrutor tentando acessar área de aluno, talvez permitir? 
            // Por enquanto, vamos ser estritos ou redirecionar para dashboard correto
            if (token?.role === 'INSTRUCTOR') {
                return NextResponse.redirect(new URL('/instructor/dashboard', req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/instructor/:path*",
        "/student/:path*",
        "/onboarding/:path*"
    ],
};
