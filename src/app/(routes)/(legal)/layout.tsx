"use client";
import { VStack } from "@/styled-system/jsx";
import Image from "next/image";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { css } from "@/styled-system/css";

export default function ({children}:{children: ReactNode}) {
    const router = useRouter();
    return (
        <VStack minH='screen' maxW='screen' overflow='auto' pt={8}>
            <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={200} height={100} onClick={() => router.push('/')} className={css({ cursor: 'pointer' })} />
            {children}
        </VStack>
    )
}