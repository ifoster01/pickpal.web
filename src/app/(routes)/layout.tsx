"use client";
import { ReactNode } from "react"
import AuthProvider from "~/providers/AuthProvider"

export default function ({children}:{children: ReactNode}) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}