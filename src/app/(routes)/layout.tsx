"use client";
import { ReactNode } from "react"
import AuthProvider from "@/providers/AuthProvider"
import QueryProvider from "@/providers/QueryProvider";
import { Footer } from "./(components)/footer";
import { Toaster } from "sonner";
import { LeagueProvider } from "@/providers/LeagueProvider";
import { FilterProvider } from "@/providers/FilterProvider";

export default function ({children}:{children: ReactNode}) {
    return (
        <QueryProvider>
            <AuthProvider>
                <LeagueProvider>
                    <FilterProvider>
                        {children}
                    </FilterProvider>
                </LeagueProvider>
                <Footer />
                <Toaster richColors closeButton position="top-right" />
            </AuthProvider>
        </QueryProvider>
    )
}