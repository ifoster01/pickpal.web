"use client";
import { VStack } from "@/styled-system/jsx";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/AuthProvider";

export default function ({children}:{children: ReactNode}) {
    const { user } = useAuth();
    const router = useRouter();

    if (user) {
        router.push('/authed');
    }

    return (
        <VStack minH='screen' maxW='screen' overflow='auto' pt={8}>
            {children}
        </VStack>
    )
}