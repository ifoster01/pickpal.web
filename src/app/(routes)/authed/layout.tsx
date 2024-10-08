"use client";
import { Grid, HStack, VStack } from "@/styled-system/jsx";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/AuthProvider";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function ({children}:{children: ReactNode}) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user]);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
    }

    return (
        <VStack minH='screen' maxW='screen' overflow='auto' pt={8}>
            {/* Navbar */}
            <Grid
                gridTemplateColumns={['175px minmax(0, 1fr) 175px']}
                w='full'
                py={4}
                px={['15%']}
                gap={4}
            >
                <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={400} height={200} onClick={() => router.push('/authed')} />
                <HStack w='full' justify='center' gap={8}>
                    <Button variant='link' cursor='pointer' onClick={() => router.push('/authed/parlays')}>Parlay Center</Button>
                    <Button variant='link' cursor='pointer' onClick={() => router.push('/authed/bets')}>Bet Calculator</Button>
                </HStack>
                <HStack w='full' justify='flex-end'>
                    <Button w='fit-content' alignSelf='flex-end' onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </HStack>
            </Grid>
            {children}
        </VStack>
    )
}