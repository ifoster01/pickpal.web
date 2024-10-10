"use client";
import { Box, HStack, VStack } from "@/styled-system/jsx";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Accordion } from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";
import { ChevronDownIcon } from "lucide-react";
import { Database } from "~/types/supabase";
import { Avatar } from "~/components/ui/avatar";
import Image from "next/image";
import { css } from "@/styled-system/css";
import { convertToProbability } from "@/utils/functions";

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

    // useEffect(() => {
    //     const fetchAPI = async () => {
    //         try {
    //             const res = await fetch('http://localhost:5000/api/draftkings');
              
    //             if (!res.ok) {
    //                 throw new Error(`HTTP error! status: ${res.status}`);
    //             }
              
    //             const result = await res.json();
    //             console.log(result);
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     };

    //     fetchAPI()
    // }, [])

    return (
        <VStack h='full' w='full' maxW='screen' px={['10%', '15%', '15%', '20%', '25%', '30%']}>
            <Accordion.Root multiple>
                { ufcData ? ufcData.map((fight) => {
                    if (!fight.odds1 || !fight.odds2) return null

                    return (
                        <Accordion.Item key={fight.fight_id} value={fight.fight_id}>
                            <Accordion.ItemTrigger>
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