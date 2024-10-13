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

export default function () {
    const [propsList, setPropsList] = useState<Prop[]>([]);
    const [currentProps, setCurrentProps] = useState<Prop[]>([]);
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
        setCurrentProps(propsList.slice(start, end));
    }

    return (
        <VStack h='full' w='full' position='relative'>
            <Text fontWeight='bold' fontSize='2xl'>
                Select Props
            </Text>
            <FilterIcon className={css({
                position: 'absolute',
                top: ['4', '4', '4', '12', '12', '12'],
                right: ['4', '4', '4', '12', '12', '12'],
                cursor: 'pointer',
            })} />
            { propsList.length && user.user ? (
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
                        count={propsList.length}
                        pageSize={20}
                        siblingCount={1}
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