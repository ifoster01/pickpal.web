"use client";
import { ReactNode } from "react"
import AuthProvider from "~/providers/AuthProvider"
import QueryProvider from "~/providers/QueryProvider";

export default function ({children}:{children: ReactNode}) {
    return (
        <QueryProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryProvider>
    )
}