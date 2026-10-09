import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user?.id) token.id = user.id;
            return token;
        },
        session({ session, token }) {
            if (token.id && session.user) session.user.id = token.id as string;
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            const isPublic = ["/", "/login", "/signup"].includes(nextUrl.pathname);
            if (!isPublic && !isLoggedIn) return false;

            // Send logged-in users away from the public landing and login pages
            // If the dashboard is not implemeted change the redirect URL accordingly
            if (isLoggedIn && (nextUrl.pathname === "/" || nextUrl.pathname === "/login")) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        },
    },
    providers: [], // providers are added in auth.ts
} satisfies NextAuthConfig;
