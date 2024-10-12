import { css } from "@/styled-system/css";
import { HStack, VStack } from "@/styled-system/jsx";
import { HeartIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Prop } from "~/types/clientTypes";
import { format } from "date-fns";

export function PropCard({
    prop
}:{
    prop: Prop
}) {
    return (
        <VStack
            p='4'
            boxShadow='md'
            borderRadius='md'
            position='relative'
        >
            <HeartIcon
                className={css({
                    position: 'absolute',
                    top: '4',
                    right: '4',
                    cursor: 'pointer',
                })}
                style={{
                    fill: Math.random() > 0.5 ? '' : 'black',
                }}
            />
            <HStack>
                <Text>{prop.eventName}</Text>
                <Text>{format(prop.eventDate, 'PP')}</Text>
            </HStack>
            <HStack>
                <Text>{prop.label}</Text>
                <Text>{prop.propLabel}</Text>
                <Text>{prop.line}</Text>
                <Text>{prop.americanOdds}</Text>
            </HStack>
        </VStack>
    )
}