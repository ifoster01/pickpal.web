import { css } from "@/styled-system/css"
import { HStack, VStack } from "@/styled-system/jsx"
import Image from "next/image"
import { Avatar } from "~/components/ui/avatar"
import { Text } from "~/components/ui/text"
import { Database } from "~/types/supabase"

export function ParlayLegCard({
    fight,
    idx
}:{
    fight: Database['public']['Tables']['upcoming_fight_odds']['Row'],
    idx: number
}) {
    if (!fight.odds1 || !fight.odds2 || !fight.f1_book_odds || !fight.f2_book_odds) {
        return null
    }
    const fighterPick = fight.odds1 < 0 ? fight.fighter1 : fight.fighter2
    const opponentPick = fight.odds1 < 0 ? fight.fighter2 : fight.fighter1
    const payout = fight.odds1 < 0 ? fight.f1_book_odds : fight.f2_book_odds
    const bookPayout = payout > 0 ? `+${payout}` : payout
    const predicted = fight.odds1 < 0 ? fight.odds1 : fight.odds2
    const predictedPayout = predicted > 0 ? `+${predicted}` : predicted
    return (
        <VStack
            w='full'
            bg='white'
            boxShadow='md'
            p={2}
            borderRadius='md'
        >
            <VStack w='full'>
                { fighterPick === fight.fighter1 ?
                    <HStack gap={1} w='full' justify='space-around'>
                        <HStack gap={8}>
                            {fight.f1_pic_url ? <Image src={fight.f1_pic_url ?? ''} alt={fight.fighter1 ?? ''} width={100} height={100} className={css({
                                borderRadius: 'full',
                                objectFit: 'cover',
                                objectPosition: 'top',
                                height: '50px',
                                width: '50px',
                            })} /> : <Avatar name={fight.fighter1 ?? ''} />}
                            <VStack gap={0}>
                                <Text fontWeight='semibold' fontSize='xl'>{fight.fighter1}</Text>
                                <Text fontSize='sm'>vs {opponentPick}</Text>
                            </VStack>
                        </HStack>
                        <HStack gap={8}>
                            <VStack gap={0}>
                                <Text>predicted:</Text>
                                <Text>{predictedPayout}</Text>
                            </VStack>
                            <VStack gap={0}>
                                <Text>book:</Text>
                                <Text>{bookPayout}</Text>
                            </VStack>
                        </HStack>
                    </HStack>
                    :
                    <HStack gap={1} w='full' justify='space-around'>
                        <HStack gap={8}>
                            {fight.f2_pic_url ? <Image src={fight.f2_pic_url ?? ''} alt={fight.fighter2 ?? ''} width={100} height={100} className={css({
                                borderRadius: 'full',
                                objectFit: 'cover',
                                objectPosition: 'top',
                                height: '50px',
                                width: '50px',
                            })} /> : <Avatar name={fight.fighter2 ?? ''} />}
                            <VStack gap={0}>
                                <Text fontWeight='semibold' fontSize='xl'>{fight.fighter2}</Text>
                                <Text fontSize='sm'>vs {opponentPick}</Text>
                            </VStack>
                        </HStack>
                        <HStack gap={8}>
                            <VStack gap={0}>
                                <Text>predicted:</Text>
                                <Text>{predictedPayout}</Text>
                            </VStack>
                            <VStack gap={0}>
                                <Text>book:</Text>
                                <Text>{bookPayout}</Text>
                            </VStack>
                        </HStack>
                    </HStack>
                }
            </VStack>
        </VStack>
    )
}