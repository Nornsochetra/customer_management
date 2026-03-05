import { getServerSession } from "next-auth";
import { authOption } from "./auth/[...nextauth]/route";

export default async function headerToken() {
    // getServerSession is used to get the token that provided from the api
    const session = await getServerSession(authOption);
    console.log("session ey ke: ", session);
    console.log("session access token ey ke: ", session?.accessToken);
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${session?.accessToken}`,
    };
}