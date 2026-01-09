import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@bora/db";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log('🔍 [AUTH] Tentativa de login:', credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ [AUTH] Credenciais vazias');
                    return null;
                }

                try {
                    console.log('🔍 [AUTH] Buscando usuário no banco...');
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string },
                    });

                    if (!user) {
                        console.log('❌ [AUTH] Usuário não encontrado');
                        return null;
                    }

                    console.log('✅ [AUTH] Usuário encontrado:', {
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        hasPassword: !!user.password
                    });

                    if (!user.password) {
                        console.log('❌ [AUTH] Usuário sem senha');
                        return null;
                    }

                    // Verificar se é admin
                    if (user.role !== "ADMIN") {
                        console.log('❌ [AUTH] Usuário não é ADMIN. Role:', user.role);
                        return null;
                    }

                    console.log('🔍 [AUTH] Verificando senha...');
                    const isPasswordValid = await compare(
                        credentials.password as string,
                        user.password
                    );

                    if (!isPasswordValid) {
                        console.log('❌ [AUTH] Senha inválida');
                        return null;
                    }

                    console.log('✅ [AUTH] Login bem-sucedido!');
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };
                } catch (error: any) {
                    console.error('❌ [AUTH] Erro:', error.message);
                    console.error('Stack:', error.stack);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async authorized({ auth, request }) {
            const { pathname } = request.nextUrl;

            // Permitir acesso às páginas de auth
            if (pathname.startsWith("/auth")) {
                return true;
            }

            // Verificar se está autenticado
            if (!auth?.user) {
                return false;
            }

            // Verificar se é admin
            if (auth.user.role !== "ADMIN") {
                return false;
            }

            return true;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
});
