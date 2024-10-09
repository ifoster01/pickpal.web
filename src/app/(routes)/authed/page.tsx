"use client";
import { HStack, VStack } from "@/styled-system/jsx";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Accordion } from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";
import { ChevronDownIcon } from "lucide-react";
import { Database } from "~/types/supabase";

export default function () {
    const [ufcData, setUfcData] = useState<Database['public']['Tables']['upcoming_fight_odds']['Row'][] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: upcoming_fight_odds, error } = await supabase
                .from('upcoming_fight_odds')
                .select('*')
                .order('id', { ascending: true })
            
            // filtering the data so only dates that are in the future are shown
            const filteredData = upcoming_fight_odds?.filter((fight) => {
                const fightDate = new Date(fight.fight_date ?? '')
                // adding a day to the fight date to account for time zone differences
                const currentDate = new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
                return fightDate >= currentDate
            })
            
            if (error) {
                throw new Error('Server Error: There was an issue fetching data from our server.');
            }

            setUfcData(filteredData ?? null)
        }

        fetchData()
    }, [])

    return (
        <VStack h='full' w='full' maxW='screen' px={['10%', '15%', '15%', '20%', '25%', '30%']}>
            <Accordion.Root multiple>
                { ufcData ? ufcData.map((fight) => {
                    if (!fight.odds1 || !fight.odds2) return null

                    return (
                        <Accordion.Item key={fight.fight_id} value={fight.fight_id}>
                            <Accordion.ItemTrigger>
                                <HStack w='full' justify='space-around'>
                                    <VStack w='full' gap={0}>
                                        <Text>{fight.fighter1}</Text>
                                        <Text>{fight.odds1 > 0 ? '+' : ''}{fight.odds1}</Text>
                                    </VStack>
                                    <Text>vs</Text>
                                    <VStack w='full' gap={0}>
                                        <Text>{fight.fighter2}</Text>
                                        <Text>{fight.odds2 > 0 ? '+' : ''}{fight.odds2}</Text>
                                    </VStack>
                                </HStack>
                                <Accordion.ItemIndicator>
                                    <ChevronDownIcon />
                                </Accordion.ItemIndicator>
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <VStack w='full' px='10%'>
                                    <Text fontWeight={700}>Model Predictions</Text>
                                    <HStack w='full' justify='space-around'>
                                        <VStack w='full' gap={0}>
                                            <Text>{fight.fighter1}</Text>
                                            <Text>{fight.odds1 > 0 ? '+' : ''}{fight.odds1}</Text>
                                        </VStack>
                                        <Text>vs</Text>
                                        <VStack w='full' gap={0}>
                                            <Text>{fight.fighter2}</Text>
                                            <Text>{fight.odds2 > 0 ? '+' : ''}{fight.odds2}</Text>
                                        </VStack>
                                    </HStack>
                                    <Text fontWeight={700}>Sports Book</Text>
                                    <HStack w='full' justify='space-around'>
                                        <VStack w='full' gap={0}>
                                            <Text>{fight.fighter1}</Text>
                                            <Text>{fight.f1_book_odds && fight.f1_book_odds > 0 ? '+' : ''}{fight.f1_book_odds ? fight.f1_book_odds : 'N/A'}</Text>
                                        </VStack>
                                        <Text>vs</Text>
                                        <VStack w='full' gap={0}>
                                            <Text>{fight.fighter2}</Text>
                                            <Text>{fight.f2_book_odds && fight.f2_book_odds > 0 ? '+' : ''}{fight.f2_book_odds ? fight.f2_book_odds : 'N/A'}</Text>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    )
                })
                    :
                    <Text>Loading...</Text>
                }
            </Accordion.Root>
        </VStack>
    )
}