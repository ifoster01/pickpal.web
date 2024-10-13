import { css } from "@/styled-system/css";
import { Grid, HStack, VStack } from "@/styled-system/jsx";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Prop } from "~/types/clientTypes";
import { format } from "date-fns";
import { Database } from "~/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "~/utils/supabase/client";

export function PropCard({
    prop,
    savedProps,
    userId,
}:{
    prop: Prop
    savedProps: Database['public']['Tables']['liked_props']['Row'][] | null
    userId: string
}) {
    const queryClient = useQueryClient();

    let liked = false;
    let savedId = '';
    // check if prop is in savedProps
    if (savedProps) {
        // find the prop in savedProps
        const savedProp = savedProps.find((savedProp) => {
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

        if (savedProp) {
            liked = true;
            savedId = savedProp.id;
        }
    }

    const likeMutation = useMutation({
        mutationFn: async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('liked_props')
                .insert([
                    {
                        userId,
                        americanOdds: prop.americanOdds,
                        eventName: prop.eventName,
                        leagueId: prop.leagueId,
                        leagueName: prop.leagueName,
                        eventId: prop.eventId,
                        category: prop.category,
                        eventDate: prop.eventDate,
                        label: prop.label,
                        propLabel: prop.propLabel,
                        line: prop.line,
                    }
                ]);
            
            if (error) {
                throw new Error('Error saving prop');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedProps'] });
        }
    })

    const unlikeMutation = useMutation({
        mutationFn: async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('liked_props')
                .delete()
                .eq('id', savedId);
            
            if (error) {
                throw new Error('Error saving prop');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedProps'] });
        }
    })

    return (
        <VStack
            p='4'
            boxShadow='md'
            borderRadius='md'
            position='relative'
        >
            <Text>{prop.category}</Text>
            <Text fontWeight='semibold' fontSize='xl'>{prop.eventName}</Text>
            <HStack>
                <Text>{prop.label}</Text>
                <Text>{prop.propLabel}</Text>
            </HStack>
            { !prop.line ?
            <VStack w='25%' p={2} borderRadius='8px' border='1px solid gray'>
                <Text>{prop.americanOdds}</Text>
            </VStack>
            :
            <Grid
                w='50%'
                gridTemplateColumns='minmax(0, 1fr) minmax(0, 1fr)'
                gap={0}
            >
                <VStack w='full' p={2} borderRadius='8px 0px 0px 8px' border='1px solid gray'>
                    <Text>{prop.line}</Text>
                </VStack>
                <VStack w='full' p={2} borderRadius='0px 8px 8px 0px' border='1px solid gray' borderLeft='none'>
                    <Text>{prop.americanOdds}</Text>
                </VStack>
            </Grid> }
            <Text>{format(prop.eventDate, 'PP')}</Text>
            <Button
                w='full'
                color='white'
                disabled={likeMutation.isPending || unlikeMutation.isPending}
                _hover={{
                    bg: 'blue.600',
                }}
                style={{
                    color: !liked ? 'white' : 'black',
                    background: !liked ? 'black' : 'white',
                    border: !liked ? 'none' : '1px solid black',
                }}
                onClick={() => {
                    if (liked) unlikeMutation.mutate();
                    if (!liked) likeMutation.mutate();
                }}
            >
                <BookmarkIcon fill='black' />
                { !liked ? 'Save' : 'Saved' }
            </Button>
        </VStack>
    )
}