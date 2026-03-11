'use client'
import { SessionProvider } from "next-auth/react"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState} from "react";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

export const Provider = ({children, session}) => {
    const [queryClient] = useState(() => new QueryClient())
    return(
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
            </QueryClientProvider>
        </SessionProvider>
    )
}