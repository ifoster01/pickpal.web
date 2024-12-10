"use client";
import { ReactNode } from "react"
import AuthProvider from "@/providers/AuthProvider"
import QueryProvider from "@/providers/QueryProvider";
import { Footer } from "./(components)/footer";
import { Toaster } from "sonner";

export default function ({children}:{children: ReactNode}) {
    return (
        <QueryProvider>
            <AuthProvider>
                {children}
                <Footer />
                <Toaster richColors closeButton position="top-right" />
            </AuthProvider>
        </QueryProvider>
    )
}