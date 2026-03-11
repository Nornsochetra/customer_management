import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import {loginService} from "@/service/auth/login_service";

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

                console.log("🟢 loginData:", loginData);

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
                token.expiresIn = user.expiresIn;
                token.roles = user.roles;
                token.username = user.username;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
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