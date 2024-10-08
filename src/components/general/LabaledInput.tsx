import { VStack } from "@/styled-system/jsx";
import { ComponentProps, ReactNode } from "react";
import { Text } from "../ui/text";

export function LabeledInput({
    label,
    input,
    ...props
}:{
    label: string
    input: ReactNode
} & ComponentProps<typeof VStack>) {
    return (
        <VStack alignItems='start' gap={0} w='full' {...props}>
            <Text fontSize='sm'>{label}</Text>
            {input}
        </VStack>
    )
}