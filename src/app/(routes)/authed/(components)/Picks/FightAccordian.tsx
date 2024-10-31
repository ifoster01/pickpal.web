import { css } from "@/styled-system/css"
import { HStack, VStack } from "@/styled-system/jsx"
import { ChevronDownIcon } from "lucide-react"
import Image from "next/image"
import { Scale } from "~/components/general/Scale"
import { Accordion } from "~/components/ui/accordion"
import { Avatar } from "~/components/ui/avatar"
import { Text } from "~/components/ui/text"
import { Database } from "~/types/supabase"

export function FightAccordian({
    fight
}:{
    fight: Database['public']['Tables']['upcoming_fight_odds']['Row']
}) {
    if (!fight.odds1 || !fight.odds2) return null

    const convertToProbability = (odds: number) => {
        if (odds < 0) {
            return Math.abs(odds) / ((Math.abs(odds) + 100))
        } else {
            return 100 / ((Math.abs(odds) + 100))
        }
    }
    
    let odds1_diff = convertToProbability(fight.odds1) - convertToProbability(fight.f1_book_odds ?? 0)
    let odds2_diff = convertToProbability(fight.odds2) - convertToProbability(fight.f2_book_odds ?? 0)
    if (fight.f1_book_odds === 0 || fight.f2_book_odds === 0) {
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
        <Accordion.Item key={fight.fight_id} value={fight.fight_id}>
            <Accordion.ItemTrigger _focus={{ outline: 'none', boxShadow: 'outline' }}>
                <HStack w='full' justify='space-around'>
                    {/* <Avatar src={fight.f1_pic_url ?? ''} name={fight.fighter1 ?? ''} objectFit={'scale-down'} objectPosition={'top'} /> */}
                    {fight.f1_pic_url ? <Image src={fight.f1_pic_url ?? ''} alt={fight.fighter1 ?? ''} width={100} height={100} className={css({
                        borderRadius: 'full',
                        objectFit: 'cover',
                        objectPosition: 'top',
                        height: '100px',
                        width: '100px',
                    })} /> : <Avatar name={fight.fighter1 ?? ''} />}
                    <VStack w='full' gap={0} textAlign='center'>
                        <Text>{fight.fighter1}</Text>
                        <Text>{fight.odds1 > 0 ? '+' : ''}{fight.odds1}</Text>
                    </VStack>
                    <Text>vs</Text>
                    <VStack w='full' gap={0} textAlign='center'>
                        <Text>{fight.fighter2}</Text>
                        <Text>{fight.odds2 > 0 ? '+' : ''}{fight.odds2}</Text>
                    </VStack>
                    {fight.f2_pic_url ? <Image src={fight.f2_pic_url ?? ''} alt={fight.fighter2 ?? ''} width={100} height={100} className={css({
                        borderRadius: 'full',
                        objectFit: 'cover',
                        objectPosition: 'top',
                        height: '100px',
                        width: '100px',
                    })} /> : <Avatar name={fight.fighter2 ?? ''} />}
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
                            <Text>{fight.fighter1}</Text>
                            <Text>{fight.odds1 > 0 ? '+' : ''}{fight.odds1} ({(convertToProbability(fight.odds1) * 100).toFixed()}%)</Text>
                        </VStack>
                        <Text>vs</Text>
                        <VStack w='full' gap={0} textAlign='center'>
                            <Text>{fight.fighter2}</Text>
                            <Text>{fight.odds2 > 0 ? '+' : ''}{fight.odds2} ({(convertToProbability(fight.odds2) * 100).toFixed()}%)</Text>
                        </VStack>
                    </HStack>
                    <Text fontWeight={700}>Sports Book</Text>
                    <HStack w='full' justify='space-around'>
                        <VStack w='full' gap={0} textAlign='center'>
                            <Text>{fight.fighter1}</Text>
                            <Text>{fight.f1_book_odds && fight.f1_book_odds > 0 ? '+' : ''}{fight.f1_book_odds ? `${fight.f1_book_odds} (${(convertToProbability(fight.f1_book_odds) * 100).toFixed()}%)` : 'N/A'}</Text>
                        </VStack>
                        <Text>vs</Text>
                        <VStack w='full' gap={0} textAlign='center'>
                            <Text>{fight.fighter2}</Text>
                            <Text>{fight.f2_book_odds && fight.f2_book_odds > 0 ? '+' : ''}{fight.f2_book_odds ? `${fight.f2_book_odds} (${(convertToProbability(fight.f2_book_odds) * 100).toFixed()}%)` : 'N/A'}</Text>
                        </VStack>
                    </HStack>
                    { value !== 0 && <Text
                        textAlign='center'
                        marginTop={4}
                    >
                        { odds1_diff > 0 ? fight.fighter1 + "'s" : fight.fighter2 + "'s" } odds have a {betText} discrepancy from the book
                    </Text> }
                    <Scale value={value} />
                </VStack>
            </Accordion.ItemContent>
        </Accordion.Item>
    )
}