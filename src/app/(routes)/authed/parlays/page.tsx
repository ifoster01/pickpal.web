import { VStack } from "@/styled-system/jsx";
import { Text } from "~/components/ui/text";

export default function () {
    return (
        <VStack h='full' w='full'>
            <Text fontWeight='bold' fontSize='2xl'>
                Page Title
            </Text>
            <Text>
                Page content goes here
            </Text>
        </VStack>
    )
}