import { VStack } from "@/styled-system/jsx";
import Image from "next/image";
import { ReactNode } from "react";

export default function ({children}:{children: ReactNode}) {
    return (
        <VStack minH='screen' maxW='screen' overflow='auto' pt={8}>
            <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={200} height={200} />
            {children}
        </VStack>
    )
}