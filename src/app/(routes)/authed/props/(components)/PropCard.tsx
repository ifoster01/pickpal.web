import { css } from "@/styled-system/css";
import { Grid, HStack, VStack } from "@/styled-system/jsx";
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
            <Text fontWeight='semibold' fontSize='xl'>{prop.eventName}</Text>
            <HStack>
                <Text>{prop.label}</Text>
                <Text>{prop.propLabel}</Text>
            </HStack>
            { prop.label === 'Moneyline' ?
            <VStack w='25%' p={2} borderRadius='8px' border='1px solid gray'>
                <Text>{prop.americanOdds}</Text>
            </VStack>
            :
            <Grid
                w='50%'
                gridTemplateColumns='minmax(0, 1fr) minmax(0, 1fr)'
                gap={0}
            >
                <VStack w='full' p={2} borderRadius='8px 0px 0px 8px' border='1px solid gray'>
                    <Text>{prop.line}</Text>
                </VStack>
                <VStack w='full' p={2} borderRadius='0px 8px 8px 0px' border='1px solid gray' borderLeft='none'>
                    <Text>{prop.americanOdds}</Text>
                </VStack>
            </Grid> }
            <Text>{format(prop.eventDate, 'PP')}</Text>
        </VStack>
    )
}