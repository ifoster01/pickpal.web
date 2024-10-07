import { VStack } from "@/styled-system/jsx";
import { Input } from "../ui/input";
import { ComponentProps } from "react";
import { Text } from "../ui/text";

export function LabeledInput({
    label,
    containerProps,
    ...props
}:{
    label: string
    containerProps?: ComponentProps<typeof VStack>
} & ComponentProps<typeof Input>) {
    return (
        <VStack alignItems='start' gap={0} w='full' {...containerProps}>
            <Text fontSize='sm'>{label}</Text>
            <Input
                w='full'
                {...props}
            />
        </VStack>
    )
}