"use client";
import { Box, HStack, VStack } from "@/styled-system/jsx";
import { createClient } from "~/utils/supabase/client";
import { useEffect, useState } from "react";
import { Accordion } from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";
import { ChevronDownIcon } from "lucide-react";
import { Database } from "~/types/supabase";
import { Avatar } from "~/components/ui/avatar";
import Image from "next/image";
import { css } from "@/styled-system/css";
import { convertToProbability } from "~/utils/functions";
import { Progress } from "~/components/ui/progress";
import { Scale } from "~/components/general/Scale";
import { LabeledInput } from "~/components/general/LabaledInput";
import { Select } from "~/components/general/Select";
import { FightAccordian } from "./(components)/Picks/FightAccordian";
import { NFLGameAccordian } from "./(components)/Picks/NFLGameAccordian";

export default function () {
    const [ufcData, setUfcData] = useState<Database['public']['Tables']['upcoming_fight_odds']['Row'][] | null>(null);
    const [nflData, setNflData] = useState<Database['public']['Tables']['upcoming_nfl_odds']['Row'][] | null>(null);
    const [league, setLeague] = useState<'ufc' | 'nfl'>('ufc')

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: upcoming_fight_odds, error: fight_error } = await supabase
                .from('upcoming_fight_odds')
                .select('*')
                .order('id', { ascending: true })
            
            // filtering the data so only dates that are in the future are shown
            const fightFilteredData = upcoming_fight_odds?.filter((fight) => {
                const fightDate = new Date(fight.fight_date ?? '')
                // adding a day to the fight date to account for time zone differences
                const currentDate = new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
                return fightDate >= currentDate
            })
            
            if (fight_error) {
                throw new Error('Server Error: There was an issue fetching fighter data from our server.');
            }

            setUfcData(fightFilteredData ?? null)

            const { data: upcoming_nfl_odds, error: nfl_error } = await supabase
                .from('upcoming_nfl_odds')
                .select('*')
            
            // filtering the data so only dates that are in the future are shown
            const nflFilteredData = upcoming_nfl_odds?.filter((game) => {
                const gameDate = new Date(game.game_date ?? '')
                // adding a day to the game date to account for time zone differences
                const currentDate = new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
                return gameDate >= currentDate
            })
            
            if (nfl_error) {
                throw new Error('Server Error: There was an issue fetching nfl data from our server.');
            }

            setNflData(nflFilteredData ?? null)
        }

        fetchData()
    }, [])

    return (
        <VStack h='full' w='full' maxW='screen' px={['10%', '15%', '15%', '20%', '25%', '30%']} position='relative'>
            <LabeledInput
                display={['none', 'none', 'none', 'block', 'block', 'block']}
                label="League"
                position='absolute'
                top={0}
                right={['10%', '15%', '15%', '20%', '25%', '30%']}
                w='fit-content'
                input={
                    <Select
                        w='fit-content'
                        groupLabels={['Select League']}
                        value={[league]}
                        onValueChange={(value) => {
                            setLeague(value.value[0] as 'ufc' | 'nfl')
                        }}
                        items={[
                            { label: 'UFC', value: 'ufc' },
                            { label: 'NFL', value: 'nfl' },
                        ]}
                    />
                }
            />
            <Text fontWeight='bold' fontSize='2xl' mb={6}>
                Model&apos; Picks
            </Text>
            <LabeledInput
                display={['block', 'block', 'block', 'none', 'none', 'none']}
                label="League"
                w='full'
                input={
                    <Select
                        w='full'
                        minW='fit-content'
                        groupLabels={['Select League']}
                        value={[league]}
                        onValueChange={(value) => {
                            setLeague(value.value[0] as 'ufc' | 'nfl')
                        }}
                        items={[
                            { label: 'UFC', value: 'ufc' },
                            { label: 'NFL', value: 'nfl' },
                        ]}
                    />
                }
            />
            <Accordion.Root multiple>
                { league === 'ufc' && ufcData ? ufcData.map((fight) => (
                    <FightAccordian fight={fight} key={fight.fight_id} />
                ))
                    : league === 'nfl' ? nflData?.map((game) => (
                        <NFLGameAccordian game={game} key={game.game_id} />
                    ))
                    :
                    <Text>Loading...</Text>
                }
            </Accordion.Root>
        </VStack>
    )
}