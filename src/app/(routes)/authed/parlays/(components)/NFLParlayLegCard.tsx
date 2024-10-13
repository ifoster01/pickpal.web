import { css } from "@/styled-system/css"
import { Grid, HStack, VStack } from "@/styled-system/jsx"
import Image from "next/image"
import { Avatar } from "~/components/ui/avatar"
import { Text } from "~/components/ui/text"
import { Database } from "~/types/supabase"

export function NFLParlayLegCard({
    pick,
    idx
}:{
    pick: Database['public']['Tables']['liked_props']['Row'],
    idx: number
}) {
    return (
        <Grid
            w='full'
            bg='white'
            boxShadow='md'
            p={2}
            borderRadius='md'
            gridTemplateColumns='minmax(0, 1fr) minmax(0, 1fr)'
        >
            <Text fontWeight='semibold' fontSize='lg' textAlign='center'>{pick.category}</Text>
            <Text textAlign='center'>{pick.label}</Text>
            <VStack gap={0}>
                <Text textAlign='center'>{pick.eventName}</Text>
                <Text textAlign='center'>{pick.propLabel}</Text>
            </VStack>
            <VStack gap={0}>
                { pick.line && <Text textAlign='center'>{pick.line}</Text> }
                <Text textAlign='center'>{pick.americanOdds}</Text>
            </VStack>
        </Grid>
    )
}