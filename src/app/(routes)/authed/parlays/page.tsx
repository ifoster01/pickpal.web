"use client";
import { HStack, VStack } from "@/styled-system/jsx";
import { convertToAmerican, convertToProbability } from "~/utils/functions";
import { createClient } from "~/utils/supabase/client";
import { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import { Database } from "~/types/supabase";
import { v4 as uuid } from 'uuid';
import { Input } from "~/components/ui/input";
import { Select } from "~/components/general/Select";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { ParlayCard } from "./(components)/ParlayCard";
import { LabeledInput } from "~/components/general/LabaledInput";
import { useAuth } from "~/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "~/components/ui/spinner";

export type Parlay = {
    picks: Database['public']['Tables']['upcoming_fight_odds']['Row'][] | Database['public']['Tables']['upcoming_nfl_odds']['Row'][] | Database['public']['Tables']['liked_props']['Row'][];
    payout: number;
    probability: number;
    id: string;
}

export default function () {
    const { user } = useAuth();
    const [ufcData, setUfcData] = useState<Database['public']['Tables']['upcoming_fight_odds']['Row'][]>([]);
    const [nflData, setNflData] = useState<Database['public']['Tables']['upcoming_nfl_odds']['Row'][]>([]);
    const [parlayLegs, setParlayLegs] = useState<number>(3);
    const [minPayout, setMinPayout] = useState<number | null>(400);
    const [generatedParlays, setGeneratedParlays] = useState<Parlay[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sortByProbability, setSortByProbability] = useState<boolean>(false);
    const [sortByPayout, setSortByPayout] = useState<boolean>(false);
    const [sortByAgreement, setSortByAgreement] = useState<boolean>(false);
    const [selectedLeague, setSelectedLeague] = useState<string>('ufc');

    const { data: nflProps, isLoading, error } = useQuery({
        queryFn: async () => {
            const supabase = createClient();
            if (!user) return null;

            console.log('getting props from supabase')

            const { data } = await supabase
                .from('liked_props')
                .select('*')
                .eq('userId', user.id);
            
                
            // filtering the data so only dates that are in the future are shown
            const filteredData = data?.filter((prop) => {
                const propDate = new Date(prop.eventDate ?? '')
                const currentDate = new Date()
                console.log('propDate:', propDate, 'currentDate:', currentDate)

                return propDate >= currentDate
            })
            console.log('got:', filteredData)
            
            return filteredData ?? null;
        },
        queryKey: ['savedProps'],
    })

    useEffect(() => {
        const getPicks = async () => {
            const supabase = createClient();
            const { data: upcoming_fight_odds, error } = await supabase
                .from('upcoming_fight_odds')
                .select('*')
                .order('id', { ascending: true })
            
            if (error) {
                console.error('Server Error', 'There was an issue fetching data from our server.')
            }

            // filtering the data so only dates that are in the future are shown
            const filteredData = upcoming_fight_odds?.filter((fight) => {
                const fightDate = new Date(fight.fight_date ?? '')
                // adding a day to the fight date to account for time zone differences
                const currentDate = new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
                return fightDate >= currentDate
            })

            setUfcData(filteredData ?? [])

            const { data: upcoming_nfl_odds, error: nflError } = await supabase
                .from('upcoming_nfl_odds')
                .select('*')
            
            if (nflError) {
                console.error('Server Error', 'There was an issue fetching data from our server.')
            }

            const filteredNFLData = upcoming_nfl_odds?.filter((game) => {
                const gameDate = new Date(game.game_date ?? '')
                // adding a day to the fight date to account for time zone differences
                const currentDate = new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
                return gameDate >= currentDate
            })

            setNflData(filteredNFLData ?? [])
        }

        if (selectedLeague === 'ufc' || selectedLeague === 'nfl') getPicks()
    }, [])

    const genNFLPropParlays = () => {
        if (!nflProps) return
        setLoading(true)

        // 1. Get all possible combinations of the nflProps based on the selected parlayLegs (between 2 and 6)
        const allCombinations = []
        if (parlayLegs === 2) {
            for (let i = 0; i < nflProps.length; i++) {
                for (let j = i + 1; j < nflProps.length; j++) {
                    allCombinations.push([nflProps[i], nflProps[j]])
                }
            }
        }
        if (parlayLegs === 3) {
            for (let i = 0; i < nflProps.length; i++) {
                for (let j = i + 1; j < nflProps.length; j++) {
                    for (let k = j + 1; k < nflProps.length; k++) {
                        allCombinations.push([nflProps[i], nflProps[j], nflProps[k]])
                    }
                }
            }
        }
        if (parlayLegs === 4) {
            for (let i = 0; i < nflProps.length; i++) {
                for (let j = i + 1; j < nflProps.length; j++) {
                    for (let k = j + 1; k < nflProps.length; k++) {
                        for (let l = k + 1; l < nflProps.length; l++) {
                            allCombinations.push([nflProps[i], nflProps[j], nflProps[k], nflProps[l]])
                        }
                    }
                }
            }
        }
        if (parlayLegs === 5) {
            for (let i = 0; i < nflProps.length; i++) {
                for (let j = i + 1; j < nflProps.length; j++) {
                    for (let k = j + 1; k < nflProps.length; k++) {
                        for (let l = k + 1; l < nflProps.length; l++) {
                            for (let m = l + 1; m < nflProps.length; m++) {
                                allCombinations.push([nflProps[i], nflProps[j], nflProps[k], nflProps[l], nflProps[m]])
                            }
                        }
                    }
                }
            }
        }

        // 2. Filter out the ones that don't meet the minPayout
        const validParlays = allCombinations.filter((parlay) => {
            const parlayOdds = parlay.reduce((acc, curr) => {
                if (!curr.americanOdds) return -1
                if (acc === -1) return -1

                if (acc === 0) {
                    return curr.americanOdds
                }

                const newOddsPerc = convertToProbability(acc) * convertToProbability(curr.americanOdds)
                const newOdds = convertToAmerican(newOddsPerc * 100)
                return newOdds
            }, 0)

            if (parlayOdds === -1) return false
            if (minPayout === null) return true
            return parlayOdds >= minPayout
        })

        // reset the generatedParlays
        setGeneratedParlays([])
        for (const parlay of validParlays) {
            const payout = parlay.reduce((acc, curr) => {
                if (!curr.americanOdds) return -1
                if (acc === -1) return -1

                if (acc === 0) {
                    return curr.americanOdds
                }

                const newOddsPerc = convertToProbability(acc) * convertToProbability(curr.americanOdds)
                const newOdds = convertToAmerican(newOddsPerc * 100)
                return newOdds
            }, 0)

            const propId = uuid().toString()
            setGeneratedParlays((prev) => [...prev, { picks: parlay, payout, probability: payout, id: propId }])
        }

        // set any sorting to false
        setSortByProbability(false)
        setSortByPayout(false)
        setSortByAgreement(false)

        // create a short artificial delay to show the loading spinner
        setTimeout(() => setLoading(false), 500)
    }

    const genNFLParlays = () => {
        // get all possible combinations of the ufcData
        // filter out the ones that don't meet the minPayout
        // display the ones that do
        setLoading(true)

        // 1. Get all possible combinations of the ufcData based on the selected parlayLegs (between 2 and 6)
        const allCombinations = []
        if (parlayLegs === 2) {
            for (let i = 0; i < nflData.length; i++) {
                for (let j = i + 1; j < nflData.length; j++) {
                    allCombinations.push([nflData[i], nflData[j]])
                }
            }
        }
        if (parlayLegs === 3) {
            for (let i = 0; i < nflData.length; i++) {
                for (let j = i + 1; j < nflData.length; j++) {
                    for (let k = j + 1; k < nflData.length; k++) {
                        allCombinations.push([nflData[i], nflData[j], nflData[k]])
                    }
                }
            }
        }
        if (parlayLegs === 4) {
            for (let i = 0; i < nflData.length; i++) {
                for (let j = i + 1; j < nflData.length; j++) {
                    for (let k = j + 1; k < nflData.length; k++) {
                        for (let l = k + 1; l < nflData.length; l++) {
                            allCombinations.push([nflData[i], nflData[j], nflData[k], nflData[l]])
                        }
                    }
                }
            }
        }
        if (parlayLegs === 5) {
            for (let i = 0; i < nflData.length; i++) {
                for (let j = i + 1; j < nflData.length; j++) {
                    for (let k = j + 1; k < nflData.length; k++) {
                        for (let l = k + 1; l < nflData.length; l++) {
                            for (let m = l + 1; m < nflData.length; m++) {
                                allCombinations.push([nflData[i], nflData[j], nflData[k], nflData[l], nflData[m]])
                            }
                        }
                    }
                }
            }
        }

        // 2. Filter out the ones that don't meet the minPayout
        const validParlays = allCombinations.filter((parlay) => {
            const parlayOdds = parlay.reduce((acc, curr) => {
                if (!curr.odds1 || !curr.odds2 || !curr.team_book_odds || !curr.opp_book_odds) return -1
                if (acc === -1) return -1

                // getting who we're betting on
                const fighter = curr.odds1 < 0 ? 0 : 1
                
                if (acc === 0) {
                    return fighter === 0 ? curr.team_book_odds : curr.opp_book_odds
                }

                // getting the percent book odds of who we're betting on
                const percentOdds = convertToProbability(fighter === 0 ? curr.team_book_odds : curr.opp_book_odds)
                const accOdds = convertToProbability(acc)
                const newOdds = (accOdds * percentOdds) * 100

                return convertToAmerican(newOdds)
            }, 0)

            if (parlayOdds === -1) return false
            if (minPayout === null) return true
            return parlayOdds >= minPayout
        })

        // reset the generatedParlays
        setGeneratedParlays([])
        for (const parlay of validParlays) {
            const payout = parlay.reduce((acc, curr) => {
                if (!curr.odds1 || !curr.odds2 || !curr.team_book_odds || !curr.opp_book_odds) return -1

                // getting who we're betting on
                const fighter = curr.odds1 < 0 ? 0 : 1
                
                if (acc === 0) {
                    return fighter === 0 ? curr.team_book_odds : curr.opp_book_odds
                }

                // getting the percent book odds of who we're betting on
                const percentOdds = convertToProbability(fighter === 0 ? curr.team_book_odds : curr.opp_book_odds)
                const accOdds = convertToProbability(acc)
                const newOdds = (accOdds * percentOdds) * 100

                return convertToAmerican(newOdds)
            }, 0)

            const probability = parlay.reduce((acc, curr) => {
                if (!curr.odds1 || !curr.odds2 || !curr.team_book_odds || !curr.opp_book_odds) return -1

                // getting who we're betting on
                const fighter = curr.odds1 < 0 ? 0 : 1
                
                if (acc === 0) {
                    return fighter === 0 ? curr.odds1 : curr.odds2
                }

                // getting the percent book odds of who we're betting on
                const percentOdds = convertToProbability(fighter === 0 ? curr.odds1 : curr.odds2)
                const accOdds = convertToProbability(acc)
                const newOdds = (accOdds * percentOdds) * 100

                return convertToAmerican(newOdds)
            }, 0)

            const gameId = uuid().toString()
            setGeneratedParlays((prev) => [...prev, { picks: parlay, payout, probability, id: gameId }])
        }

        // sorting by largest payout-probability discrepancy
        setGeneratedParlays((prev) => prev.sort((a, b) => {
            return (b.payout - b.probability) - (a.payout - a.probability)
        }))

        // set any sorting to false
        setSortByProbability(false)
        setSortByPayout(false)
        setSortByAgreement(false)

        // create a short artificial delay to show the loading spinner
        setTimeout(() => setLoading(false), 500)
    }

    const genParlays = () => {
        // get all possible combinations of the ufcData
        // filter out the ones that don't meet the minPayout
        // display the ones that do
        setLoading(true)

        // 1. Get all possible combinations of the ufcData based on the selected parlayLegs (between 2 and 6)
        const allCombinations = []
        if (parlayLegs === 2) {
            for (let i = 0; i < ufcData.length; i++) {
                for (let j = i + 1; j < ufcData.length; j++) {
                    allCombinations.push([ufcData[i], ufcData[j]])
                }
            }
        }
        if (parlayLegs === 3) {
            for (let i = 0; i < ufcData.length; i++) {
                for (let j = i + 1; j < ufcData.length; j++) {
                    for (let k = j + 1; k < ufcData.length; k++) {
                        allCombinations.push([ufcData[i], ufcData[j], ufcData[k]])
                    }
                }
            }
        }
        if (parlayLegs === 4) {
            for (let i = 0; i < ufcData.length; i++) {
                for (let j = i + 1; j < ufcData.length; j++) {
                    for (let k = j + 1; k < ufcData.length; k++) {
                        for (let l = k + 1; l < ufcData.length; l++) {
                            allCombinations.push([ufcData[i], ufcData[j], ufcData[k], ufcData[l]])
                        }
                    }
                }
            }
        }
        if (parlayLegs === 5) {
            for (let i = 0; i < ufcData.length; i++) {
                for (let j = i + 1; j < ufcData.length; j++) {
                    for (let k = j + 1; k < ufcData.length; k++) {
                        for (let l = k + 1; l < ufcData.length; l++) {
                            for (let m = l + 1; m < ufcData.length; m++) {
                                allCombinations.push([ufcData[i], ufcData[j], ufcData[k], ufcData[l], ufcData[m]])
                            }
                        }
                    }
                }
            }
        }

        // 2. Filter out the ones that don't meet the minPayout
        const validParlays = allCombinations.filter((parlay) => {
            const parlayOdds = parlay.reduce((acc, curr) => {
                if (!curr.odds1 || !curr.odds2 || !curr.f1_book_odds || !curr.f2_book_odds) return -1
                if (acc === -1) return -1

                // getting who we're betting on
                const fighter = curr.odds1 < 0 ? 0 : 1
                
                if (acc === 0) {
                    return fighter === 0 ? curr.f1_book_odds : curr.f2_book_odds
                }

                // getting the percent book odds of who we're betting on
                const percentOdds = convertToProbability(fighter === 0 ? curr.f1_book_odds : curr.f2_book_odds)
                const accOdds = convertToProbability(acc)
                const newOdds = (accOdds * percentOdds) * 100

                return convertToAmerican(newOdds)
            }, 0)

            if (parlayOdds === -1) return false
            if (minPayout === null) return true
            return parlayOdds >= minPayout
        })

        // reset the generatedParlays
        setGeneratedParlays([])
        for (const parlay of validParlays) {
            const payout = parlay.reduce((acc, curr) => {
                if (!curr.odds1 || !curr.odds2 || !curr.f1_book_odds || !curr.f2_book_odds) return -1

                // getting who we're betting on
                const fighter = curr.odds1 < 0 ? 0 : 1
                
                if (acc === 0) {
                    return fighter === 0 ? curr.f1_book_odds : curr.f2_book_odds
                }

                // getting the percent book odds of who we're betting on
                const percentOdds = convertToProbability(fighter === 0 ? curr.f1_book_odds : curr.f2_book_odds)
                const accOdds = convertToProbability(acc)
                const newOdds = (accOdds * percentOdds) * 100

                return convertToAmerican(newOdds)
            }, 0)

            const probability = parlay.reduce((acc, curr) => {
                if (!curr.odds1 || !curr.odds2 || !curr.f1_book_odds || !curr.f2_book_odds) return -1

                // getting who we're betting on
                const fighter = curr.odds1 < 0 ? 0 : 1
                
                if (acc === 0) {
                    return fighter === 0 ? curr.odds1 : curr.odds2
                }

                // getting the percent book odds of who we're betting on
                const percentOdds = convertToProbability(fighter === 0 ? curr.odds1 : curr.odds2)
                const accOdds = convertToProbability(acc)
                const newOdds = (accOdds * percentOdds) * 100

                return convertToAmerican(newOdds)
            }, 0)

            const fightId = uuid().toString()
            setGeneratedParlays((prev) => [...prev, { picks: parlay, payout, probability, id: fightId }])
        }

        // sorting by largest payout-probability discrepancy
        setGeneratedParlays((prev) => prev.sort((a, b) => {
            return (b.payout - b.probability) - (a.payout - a.probability)
        }))

        // set any sorting to false
        setSortByProbability(false)
        setSortByPayout(false)
        setSortByAgreement(false)

        // create a short artificial delay to show the loading spinner
        setTimeout(() => setLoading(false), 500)
    }

    useEffect(() => {
        if (!generatedParlays) return
    
        let sortedParlays = [...generatedParlays]
    
        if (sortByProbability) {
            sortedParlays.sort((a, b) => a.probability - b.probability)
        } else if (sortByPayout) {
            sortedParlays.sort((a, b) => b.payout - a.payout)
        } else if (sortByAgreement) {
        // getting the parlays with the smallest discrepancy between the payout and the probability
            sortedParlays.sort((a, b) => (a.payout - a.probability) - (b.payout - b.probability))
        } else {
            sortedParlays.sort((a, b) => (b.payout - b.probability) - (a.payout - a.probability))
        }
    
        setGeneratedParlays(sortedParlays)
    }, [sortByProbability, sortByPayout])

    return (
        <VStack h='full' w='full' p={[5, 5, 5, 10, 10, 10]} position='relative'>
            <LabeledInput
                display={['none', 'none', 'none', 'block', 'block', 'block']}
                label="League"
                position='absolute'
                top={0}
                right={8}
                w='fit-content'
                input={
                    <Select
                        w='fit-content'
                        groupLabels={['Select League']}
                        value={[selectedLeague]}
                        onValueChange={(value) => {
                            setGeneratedParlays([])
                            setSelectedLeague(value.value[0])
                        }}
                        items={[
                            { label: 'UFC', value: 'ufc' },
                            { label: 'NFL', value: 'nfl' },
                            { label: 'NFL Props', value: 'nflprops' },
                        ]}
                    />
                }
            />
            <Text fontWeight='bold' fontSize='2xl'>
                Parlay Center
            </Text>
            <LabeledInput
                display={['block', 'block', 'block', 'none', 'none', 'none']}
                label="League"
                input={
                    <Select
                        groupLabels={['Select League']}
                        value={[selectedLeague]}
                        onValueChange={(value) => {
                            setGeneratedParlays([])
                            setSelectedLeague(value.value[0])
                        }}
                        items={[
                            { label: 'UFC', value: 'ufc' },
                            { label: 'NFL', value: 'nfl' },
                            { label: 'NFL Props', value: 'nflprops' },
                        ]}
                    />
                }
            />
            <HStack w={['100%', '100%', '70%', '50%', '50%', '40%']}>
                <LabeledInput
                    label="Parlay Legs"
                    input={
                        <Select
                            w='100%'
                            value={[parlayLegs.toString()]}
                            onValueChange={(value) => setParlayLegs(parseInt(value.value[0]))}
                            items={[
                                { label: '2', value: '2' },
                                { label: '3', value: '3' },
                                { label: '4', value: '4' },
                                { label: '5', value: '5' },
                            ]}
                        />
                    }
                />
                <LabeledInput
                    label="Min Odds"
                    w='100%'
                    input={
                        <Input
                            width='100%'
                            type='number'
                            value={minPayout ?? 0}
                            placeholder='Min odds'
                            onChange={(e) => {
                                const text = e.target.value
        
                                if (isNaN(parseInt(text)) && text !== '' && text !== '+') return
                                if (isNaN(parseInt(text)) && text === '+') return setMinPayout(null)
                                if (isNaN(parseInt(text))) return setMinPayout(null)
        
                                setMinPayout(parseInt(text))
                            }}
                        />
                    }
                />
            </HStack>
            <Button w={['100%', '100%', '70%', '50%', '50%', '40%']} onClick={() => {
                if (selectedLeague === 'ufc') genParlays()
                if (selectedLeague === 'nfl') genNFLParlays()
                if (selectedLeague === 'nfl') genNFLPropParlays()
            }} fontWeight={700}>
                {loading ? 'loading...' : 'Generate'}
            </Button>
            <HStack>
                <Switch
                    mt={8}
                    checked={sortByProbability}
                    onChange={() => {
                        setSortByProbability(!sortByProbability)
                        setSortByPayout(false)
                        setSortByAgreement(false)
                    }}
                >
                    Sort by Probability
                </Switch>
                <Switch
                    mt={8}
                    checked={sortByPayout}
                    onChange={() => {
                        setSortByPayout(!sortByPayout)
                        setSortByProbability(false)
                        setSortByAgreement(false)
                    }}
                >
                    Sort by Payout
                </Switch>
            </HStack>
            { selectedLeague === 'nflprops' && !nflProps && !isLoading ? (
                <Text>No saved NFL Props!</Text>
            ) : selectedLeague === 'nflprops' && !nflProps && isLoading ? (
                <HStack mt='10vh'>
                    <Spinner />
                    <Text>Loading NFL Props...</Text>
                </HStack>
            )
            :
            (
                <>
                { generatedParlays && (
                  <VStack mt={8} w={['100%', '100%', '70%', '50%', '50%', '40%']}>
                    { generatedParlays.slice(0, 25).map((parlay, i) => (
                      <ParlayCard key={`${i}-${parlay.id}`} parlay={parlay} idx={i} league={selectedLeague} />
                    ))}
                  </VStack>
                )}
                </>
            )}
        </VStack>
    )
}