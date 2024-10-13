"use client";
import { Grid, HStack, VStack } from "@/styled-system/jsx";
import { createClient } from "~/utils/supabase/client";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useEffect, useState } from "react";
import { Prop } from "~/types/clientTypes";
import { Spinner } from "~/components/ui/spinner";
import { PropCard } from "./(components)/PropCard";
import { Pagination } from "~/components/ui/pagination";
import { FilterIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/providers/AuthProvider";
import { Drawer } from "~/components/general/Drawer";
import { LabeledInput } from "~/components/general/LabaledInput";
import { categories, NFLTeams } from "~/constants/props";
import { Combobox } from "~/components/general/Combobox";
import { Drawer as PDrawer } from "~/components/ui/drawer";
import { Switch } from "~/components/ui/switch";

export default function () {
    const [loading, setLoading] = useState<boolean>(true);
    const [propsList, setPropsList] = useState<Prop[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentProps, setCurrentProps] = useState<Prop[]>([]);
    const [filteredProps, setFilteredProps] = useState<Prop[]>([]);
    const [teamFilter, setTeamFilter] = useState<string[] | null>(null);
    const [teamFilterString, setTeamFilterString] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string[] | null>(null);
    const [categoryFilterString, setCategoryFilterString] = useState<string | null>(null);
    const [filterSaved, setFilterSaved] = useState<boolean>(false);
    const user = useAuth();

    useEffect(() => {
        const fetchProps = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data: jwtTokenData } = await supabase.auth.getSession();
            if (!jwtTokenData?.session?.access_token) return;
    
            const res = await fetch("https://tkha48orgc.execute-api.us-east-1.amazonaws.com/props?leagueId=88808", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwtTokenData.session.access_token,
                },
            });
            const data = await res.json();
            const props = JSON.parse(data.body);
            setPropsList(props);
            setFilteredProps(props);
            setCurrentProps(props.slice(0, 20));
            setLoading(false);
        }

        fetchProps();
    }, []);

    const { data: savedProps, isLoading, error } = useQuery({
        queryFn: async () => {
            const supabase = createClient();
            if (!user.user) return null;

            const { data } = await supabase
                .from('liked_props')
                .select('*')
                .eq('userId', user.user?.id);
            
            return data ?? null;
        },
        queryKey: ['savedProps'],
    })

    // getting the previous or next 20 picks based on the current page
    const handlePageChange = async (page: number) => {
        const start = (page - 1) * 20;
        const end = page * 20;
        setCurrentPage(page);
        setCurrentProps(filteredProps.slice(start, end));
    }

    // applying filters
    const handleApplyFilters = () => {
        let filteredProps = propsList;

        if (teamFilter) {
            filteredProps = filteredProps.filter((prop) => {
                for (const team of teamFilter) {
                    if (prop.eventName.includes(team))
                        return true;
                }
            });
        }

        if (categoryFilter) {
            filteredProps = filteredProps.filter((prop) => {
                for (const category of categoryFilter) {
                    if (prop.category === category)
                        return true;
                }
            });
        }

        if (filterSaved) {
            filteredProps = filteredProps.filter((prop) => {
                if (!savedProps) return false;
                return savedProps.find((savedProp) => {
                    return (
                        savedProp.americanOdds === prop.americanOdds &&
                        savedProp.eventName === prop.eventName &&
                        savedProp.leagueId === prop.leagueId &&
                        savedProp.eventId === prop.eventId &&
                        savedProp.category === prop.category &&
                        new Date(savedProp.eventDate ?? '').getTime() === new Date(prop.eventDate).getTime() &&
                        savedProp.label === prop.label &&
                        savedProp.propLabel === prop.propLabel
                    )
                });
            });
        }
        
        setCurrentPage(1);
        setFilteredProps(filteredProps);
        setCurrentProps(filteredProps.slice(0, 20));
    }

    useEffect(() => {
        handleApplyFilters();
    }, [filterSaved]);

    return (
        <VStack h='full' w='full' position='relative'>
            <Text fontWeight='bold' fontSize='2xl'>
                Select Props
            </Text>
            <HStack
                w='fit-content'
                position='absolute'
                top={['4', '4', '4', '12', '12', '12']}
                left={['4', '4', '4', '12', '12', '12']}
                cursor='pointer'
            >
                <Text>Saved</Text>
                <Switch
                    checked={filterSaved}
                    onCheckedChange={(e) => setFilterSaved(e.checked)}
                />
            </HStack>
            <Drawer
                headerTitle='Filter Props'
                trigger={
                    <HStack
                        w='fit-content'
                        position='absolute'
                        top={['4', '4', '4', '12', '12', '12']}
                        right={['4', '4', '4', '12', '12', '12']}
                        cursor='pointer'
                    >
                        <Text>Filter</Text>
                        <FilterIcon />
                    </HStack>
                }
                footer={
                    <HStack w='full'>
                        <PDrawer.CloseTrigger asChild>
                            <Button
                                w='full'
                                variant='outline'
                                onClick={() => {
                                    setTeamFilter(null);
                                    setCategoryFilter(null);
                                    setFilteredProps(propsList);
                                    setCurrentProps(propsList.slice(0, 20));
                                }}
                            >
                                Clear Filters
                            </Button>
                        </PDrawer.CloseTrigger>
                        <PDrawer.CloseTrigger asChild>
                            <Button onClick={handleApplyFilters} w='full'>Apply Filters</Button>
                        </PDrawer.CloseTrigger>
                    </HStack>
                }
            >
                <VStack p={4} w='full'>
                    <LabeledInput
                        label='Filter by team'
                        input={
                            <Combobox
                                multiple
                                items={NFLTeams}
                                label='Team'
                                placeholder={teamFilter?.length && teamFilterString ? teamFilterString : 'Select a team'}
                                value={teamFilter ?? []}
                                onValueChange={(e) => {
                                    // creating the string to display in the placeholder
                                    let string = '';
                                    let i = 0;
                                    for (const team of e.value) {
                                        if (i === e.value.length - 1) {
                                            string += `${team}`;
                                        } else {
                                            string += `${team}, `;
                                        }
                                        i++;
                                    }
                                    setTeamFilterString(string);
                                    setTeamFilter(e.value)
                                }}
                            />
                        }
                    />
                    <LabeledInput
                        label='Filter by category'
                        input={
                            <Combobox
                                multiple
                                items={categories}
                                label='Category'
                                placeholder={categoryFilter?.length && categoryFilterString ? categoryFilterString : 'Select a category'}
                                value={categoryFilter ?? []}
                                onValueChange={(e) => {
                                    // creating the string to display in the placeholder
                                    let string = '';
                                    let i = 0;
                                    for (const category of e.value) {
                                        if (i === e.value.length - 1) {
                                            string += `${category}`;
                                        } else {
                                            string += `${category}, `;
                                        }
                                        i++;
                                    }
                                    setCategoryFilterString(string);
                                    setCategoryFilter(e.value)
                                }}
                            />
                        }
                    />
                </VStack>
            </Drawer>
            { filteredProps.length && user.user && !loading ? (
                <VStack w='full' p={12}>
                    <Grid
                        w='full'
                        gridTemplateColumns={['minmax(0, 1fr)', 'minmax(0, 1fr)', 'minmax(0, 1fr) minmax(0, 1fr)', 'minmax(0, 1fr) minmax(0, 1fr)', 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)']}
                    >
                        { currentProps.slice(0, 25).map((prop, idx) => (
                            <PropCard key={`${idx}-${prop.leagueId}-${prop.eventId}-${prop.propLabel}`} prop={prop} savedProps={savedProps ?? null} userId={user.user!.id} />
                        ))}
                    </Grid>
                    <Pagination
                        count={filteredProps.length}
                        pageSize={20}
                        siblingCount={1}
                        page={currentPage}
                        onPageChange={(e) => {
                            handlePageChange(e.page);
                        }}
                    />
                </VStack>
            )
            : loading ?
            (
                <HStack mt={['20%', '20%', '20%', '20%', '20%', '20%']}>
                    <Spinner />
                    <Text>Loading props...</Text>
                </HStack>
            )
            : (
                <HStack mt={['20%', '20%', '20%', '20%', '20%', '20%']}>
                    <Text>No props available for the selected filters</Text>
                </HStack>
            )
            }
        </VStack>
    )
}