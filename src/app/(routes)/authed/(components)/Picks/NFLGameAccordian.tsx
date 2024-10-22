import { css } from "@/styled-system/css"
import { HStack, VStack } from "@/styled-system/jsx"
import { ChevronDownIcon } from "lucide-react"
import Image from "next/image"
import { Scale } from "~/components/general/Scale"
import { Accordion } from "~/components/ui/accordion"
import { Avatar } from "~/components/ui/avatar"
import { Text } from "~/components/ui/text"
import { Database } from "~/types/supabase"

export function NFLGameAccordian({
    game
}:{
    game: Database['public']['Tables']['upcoming_nfl_odds']['Row']
}) {
    if (!game.odds1 || !game.odds2) return null

    const convertToProbability = (odds: number) => {
        if (odds < 0) {
            return Math.abs(odds) / ((Math.abs(odds) + 100))
        } else {
            return 100 / ((Math.abs(odds) + 100))
        }
        }
    
        let odds1_diff = convertToProbability(game.odds1) - convertToProbability(game.team_book_odds ?? 0)
        let odds2_diff = convertToProbability(game.odds2) - convertToProbability(game.opp_book_odds ?? 0)
        if (game.team_book_odds === 0 || game.opp_book_odds === 0) {
        odds1_diff = 0
        odds2_diff = 0
        }
    
        let value = odds1_diff > 0 ? -1*odds1_diff : odds2_diff
        if (odds1_diff === 0 && odds2_diff < 0 || odds1_diff < 0 && odds2_diff === 0) {
        value = 0
        }

        const betText = Math.abs(value) > 0.4 ? 'huge' :
                        Math.abs(value) > 0.3 ? 'large' :
                        Math.abs(value) > 0.1 ? 'medium' :
                        Math.abs(value) > 0.05 ? 'small' :
                        'almost no'

    return (
        <Accordion.Item key={game.game_id} value={game.game_id}>
            <Accordion.ItemTrigger _focus={{ outline: 'none', boxShadow: 'outline' }}>
                <HStack w='full' justify='space-around'>
                    {/* <Avatar src={game.team_pic_url ?? ''} name={game.team_name ?? ''} objectFit={'scale-down'} objectPosition={'top'} /> */}
                    <Avatar src={game.team_pic_url ?? ''} name={game.team_name ?? ''} />
                    <VStack w='full' gap={0} textAlign='center'>
                        <Text>{game.team_name}</Text>
                        <Text>{game.odds1 > 0 ? '+' : ''}{game.odds1}</Text>
                    </VStack>
                    <Text>vs</Text>
                    <VStack w='full' gap={0} textAlign='center'>
                        <Text>{game.opp_name}</Text>
                        <Text>{game.odds2 > 0 ? '+' : ''}{game.odds2}</Text>
                    </VStack>
                    <Avatar src={game.opp_pic_url ?? ''} name={game.opp_name ?? ''} />
                </HStack>
                <Accordion.ItemIndicator>
                    <ChevronDownIcon />
                </Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <VStack w='full' px='10%'>
                    <Text fontWeight={700}>Model Predictions</Text>
                    <HStack w='full' justify='space-around'>
                        <VStack w='full' gap={0} textAlign='center'>
                            <Text>{game.team_name}</Text>
                            <Text>{game.odds1 > 0 ? '+' : ''}{game.odds1} ({(convertToProbability(game.odds1) * 100).toFixed()}%)</Text>
                        </VStack>
                        <Text>vs</Text>
                        <VStack w='full' gap={0} textAlign='center'>
                            <Text>{game.opp_name}</Text>
                            <Text>{game.odds2 > 0 ? '+' : ''}{game.odds2} ({(convertToProbability(game.odds2) * 100).toFixed()}%)</Text>
                        </VStack>
                    </HStack>
                    <Text fontWeight={700}>Sports Book</Text>
                    <HStack w='full' justify='space-around'>
                        <VStack w='full' gap={0} textAlign='center'>
                            <Text>{game.team_name}</Text>
                            <Text>{game.team_book_odds && game.team_book_odds > 0 ? '+' : ''}{game.team_book_odds ? `${game.team_book_odds} (${(convertToProbability(game.team_book_odds) * 100).toFixed()}%)` : 'N/A'}</Text>
                        </VStack>
                        <Text>vs</Text>
                        <VStack w='full' gap={0} textAlign='center'>
                            <Text>{game.opp_name}</Text>
                            <Text>{game.opp_book_odds && game.opp_book_odds > 0 ? '+' : ''}{game.opp_book_odds ? `${game.opp_book_odds} (${(convertToProbability(game.opp_book_odds) * 100).toFixed()}%)` : 'N/A'}</Text>
                        </VStack>
                    </HStack>
                    { value !== 0 && <Text
                        textAlign='center'
                        marginTop={4}
                    >
                        { odds1_diff > 0 ? game.team_name + "'s" : game.opp_name + "'s" } odds have a {betText} discrepancy from the book
                    </Text> }
                    <Scale value={value} />
                </VStack>
            </Accordion.ItemContent>
        </Accordion.Item>
    )
}