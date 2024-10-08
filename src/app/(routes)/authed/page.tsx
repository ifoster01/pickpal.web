"use client";
import { VStack } from "@/styled-system/jsx";
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
        <VStack h='full' w='full' maxW='screen'>
            <Accordion.Root
                multiple
            >
                { ufcData ? ufcData.map((fight) => (
                    <Accordion.Item key={fight.fight_id} value={fight.fight_id}>
                        <Accordion.ItemTrigger>
                            {fight.fighter1} vs {fight.fighter2}
                            <Accordion.ItemIndicator>
                                <ChevronDownIcon />
                            </Accordion.ItemIndicator>
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            {fight.odds1} vs {fight.odds2}
                        </Accordion.ItemContent>
                    </Accordion.Item>
                ))
                    :
                    <Text>Loading...</Text>
                }
            </Accordion.Root>
        </VStack>
    )
}