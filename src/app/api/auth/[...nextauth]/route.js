import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import {loginService, refreshTokenService} from "@/service/auth/login_service";

export const authOption = {
    providers: [
        CredentialsProvider({
            name: "Credentials",

            async authorize(credentials) {
                const userInfo = await loginService({
                    username: credentials?.username,
                    password: credentials?.password,
                });

                console.log("🟡 authorize userInfo:", userInfo);

                // login fail
                if (userInfo?.status !== 200) {
                    throw new Error("Invalid credentials");
                }

                const loginData = userInfo.data.data;

                console.log("🟢 loginData ey ke: ", loginData);

                // Return clean user object
                return {
                    id: loginData.userInfo.customerId,
                    username: loginData.userInfo?.username,
                    roles: loginData.userInfo?.roles,
                    accessToken: loginData?.accessToken,
                    refreshToken: loginData?.refreshToken,
                    expiresIn: loginData?.expiresIn,
                };
            },
        })
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.roles = user.roles;
                token.username = user.username;
                token.id = user.id;
                token.expiresIn = user.expiresIn;
                token.accessTokenExpires = Date.now() + user.expiresIn * 1000;
            }
            if(Date.now() < token.accessTokenExpires) {
                return token;
            }
            console.log("🔴 Token expired, refreshing...");
            try {
                const res = await refreshTokenService(token.refreshToken);
                if (res.status !== 200) {
                    console.error("🔴 Refresh failed:", res?.status);
                    return { ...token, error: "RefreshTokenError" };
                }
                const data = res?.data?.data;
                console.log("🟢 Token refreshed! ey ke: ",data);
                return {
                    ...token,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    expiresIn: data.expiresIn,
                    accessTokenExpires: Date.now() + data.expiresIn * 1000,
                }
            }catch (error) {
                console.error("🔴 Refresh error:", error);
                return { ...token, error: "RefreshTokenError" };
            }
        },
        async session({ session, token }) {
            console.log("🟣 session token:", token);
            session.user = {
                id: token.id,
                username: token.username,
                roles: token.roles,
            };

            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.expiresIn = token.expiresIn;

            return session;
        }
    },
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST};