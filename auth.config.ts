import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // TEST: Protect the /new route for unauthenticated users
      // Visit /users/new to trigger sign-in
      if (nextUrl.pathname.endsWith('/new')) {
        if (isLoggedIn) return true;
        return false; // redirects to /login
      }

      if (nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) return false;

      // Send logged-in users away from the public landing and login pages
      // If the dashboard is not implemeted change the redirect URL accordingly
      if (isLoggedIn && (nextUrl.pathname === '/' || nextUrl.pathname === '/login')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
  providers: [], // providers are added in auth.ts
} satisfies NextAuthConfig;