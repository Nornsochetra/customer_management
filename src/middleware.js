import { withAuth } from "next-auth/middleware";

export const middleware = withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
});

// route protected
export const config = {
    matcher: ['/customer', '/customer/:path*']
};