"use client";
import { VStack } from "@/styled-system/jsx";
import Image from "next/image";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { css } from "@/styled-system/css";
import { IconButton } from "~/components/ui/icon-button";
import { ArrowLeftIcon } from "lucide-react";

export default function ({children}:{children: ReactNode}) {
    const router = useRouter();
    return (
        <VStack minH='screen' maxW='screen' overflow='auto' pt={8}>
            <IconButton position='absolute' top={4} left={4} variant='ghost' onClick={() => router.back()}>
                <ArrowLeftIcon size={24} />
            </IconButton>
            <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={200} height={100} onClick={() => router.push('/')} className={css({ cursor: 'pointer' })} />
            {children}
        </VStack>
    )
}