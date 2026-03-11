import { baseUrl } from "@/service/constants";

export const loginService = async ({username, password}) => {
    try {
        const res = await fetch(`${baseUrl}/auth/login`,{
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            })
        });
        const data = await res.json();
        return {
            status: res.status,
            data,
        };

    }catch(error) {
        console.log("Error: ", error);
    }
}

export const refreshTokenService = async (token) => {
    try {
        const res = await fetch(`${baseUrl}/auth/refresh?refreshToken=${token}`,{
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        return{
            status: res.status,
            data,
        };
    }catch(error) {
        console.log("Error: ", error);
    }
}