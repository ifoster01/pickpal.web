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
import { css } from "@/styled-system/css";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/providers/AuthProvider";
import { Drawer } from "~/components/general/Drawer";
import { LabeledInput } from "~/components/general/LabaledInput";
import { Select } from "~/components/general/Select";
import { categories, NFLTeams } from "~/constants/props";
import { Combobox } from "~/components/general/Combobox";
import { Drawer as PDrawer } from "~/components/ui/drawer";

export default function () {
    const [propsList, setPropsList] = useState<Prop[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentProps, setCurrentProps] = useState<Prop[]>([]);
    const [filteredProps, setFilteredProps] = useState<Prop[]>([]);
    const [teamFilter, setTeamFilter] = useState<string[] | null>(null);
    const [teamFilterString, setTeamFilterString] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string[] | null>(null);
    const [categoryFilterString, setCategoryFilterString] = useState<string | null>(null);
    const user = useAuth();

    useEffect(() => {
        const fetchProps = async () => {
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

        console.log(teamFilter, categoryFilter);

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
        
        setCurrentPage(1);
        setFilteredProps(filteredProps);
        setCurrentProps(filteredProps.slice(0, 20));
    }

    return (
        <VStack h='full' w='full' position='relative'>
            <Text fontWeight='bold' fontSize='2xl'>
                Select Props
            </Text>
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
            { filteredProps.length && user.user ? (
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
            :
            (
                <HStack mt={['20%', '20%', '20%', '20%', '20%', '20%']}>
                    <Spinner />
                    <Text>Loading props...</Text>
                </HStack>
            )}
        </VStack>
    )
}