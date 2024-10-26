import { css } from "@/styled-system/css"
import { HStack, VStack } from "@/styled-system/jsx"
import Image from "next/image"
import { Avatar } from "~/components/ui/avatar"
import { Text } from "~/components/ui/text"
import { Database } from "~/types/supabase"

export function NFLParlayLegCard({
    game,
    idx
}:{
    game: Database['public']['Tables']['upcoming_nfl_odds']['Row'],
    idx: number
}) {
    if (!game.odds1 || !game.odds2 || !game.team_book_odds || !game.opp_book_odds) {
        return null
    }
    const gamePick = game.odds1 < 0 ? game.team : game.opp
    const opponentPick = game.odds1 < 0 ? game.opp : game.team
    const payout = game.odds1 < 0 ? game.team_book_odds : game.opp_book_odds
    const bookPayout = payout > 0 ? `+${payout}` : payout
    const predicted = game.odds1 < 0 ? game.odds1 : game.odds2
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
                { gamePick === game.team ?
                    <HStack gap={1} w='full' justify='space-around'>
                        <HStack gap={[2, 2, 2, 8, 8, 8]}>
                            {game.team_pic_url ? <Image src={game.team_pic_url ?? ''} alt={game.team ?? ''} width={100} height={100} className={css({
                                borderRadius: 'full',
                                objectFit: 'cover',
                                objectPosition: 'top',
                                height: '50px',
                                width: '50px',
                            })} /> : <Avatar name={game.team ?? ''} />}
                            <VStack gap={0}>
                                <Text textAlign='center' fontWeight='semibold' fontSize='xl'>{game.team}</Text>
                                <Text textAlign='center' fontSize='sm'>vs {opponentPick}</Text>
                            </VStack>
                        </HStack>
                        <HStack gap={[2, 2, 2, 8, 8, 8]}>
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
                        <HStack gap={[2, 2, 2, 8, 8, 8]}>
                            {game.opp_pic_url ? <Image src={game.opp_pic_url ?? ''} alt={game.opp ?? ''} width={100} height={100} className={css({
                                borderRadius: 'full',
                                objectFit: 'cover',
                                objectPosition: 'top',
                                height: '50px',
                                width: '50px',
                            })} /> : <Avatar name={game.opp ?? ''} />}
                            <VStack gap={0}>
                                <Text textAlign='center' fontWeight='semibold' fontSize='xl'>{game.opp}</Text>
                                <Text textAlign='center' fontSize='sm'>vs {opponentPick}</Text>
                            </VStack>
                        </HStack>
                        <HStack gap={[2, 2, 2, 8, 8, 8]}>
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