import { baseUrl } from "@/service/constants";

export const loginService = async ({username, password}) => {
    try {
        const res = await fetch(`${baseUrl}/auth/login`,{
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
                // "Accept": "*/*",
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