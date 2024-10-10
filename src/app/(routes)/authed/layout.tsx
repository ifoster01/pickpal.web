"use client";
import { Grid, HStack, VStack } from "@/styled-system/jsx";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/AuthProvider";
// import { Navbar } from "./(components)/Navigation/Navbar";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { IconButton } from "~/components/ui/icon-button";
import { LogOutIcon, MenuIcon, XIcon } from "lucide-react";
import { Drawer } from "~/components/ui/drawer";
import { Text } from "~/components/ui/text";

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
        router.push('/auth/login');
    }

    return (
        <VStack minH='screen' maxW='screen' overflow='auto'>
            {/* Navbar */}
            {/* <Navbar /> */}
            <HStack px='10%' py={4} w='full' display={["flex", "flex", "flex", "none", "none", "none"]} justify='space-between'>
                <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={200} height={100} onClick={() => router.push('/authed')} />
                <Drawer.Root>
                    <Drawer.Trigger asChild>
                        <IconButton w='fit-content'>
                            <MenuIcon size={24} />
                        </IconButton>
                    </Drawer.Trigger>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.Header>
                                <Drawer.Title>
                                    <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={200} height={100} onClick={() => router.push('/authed')} />
                                </Drawer.Title>
                                <Drawer.CloseTrigger asChild position="absolute" top="3" right="4">
                                    <IconButton variant="ghost">
                                        <XIcon height={48} width={48} />
                                    </IconButton>
                                </Drawer.CloseTrigger>
                            </Drawer.Header>
                            <Drawer.Body>
                                <VStack>
                                    <Drawer.CloseTrigger asChild>
                                        <Button w='full' variant='outline' cursor='pointer' onClick={() => router.push('/authed')}>Model&apos;s Picks</Button>
                                    </Drawer.CloseTrigger>
                                    <Drawer.CloseTrigger asChild>
                                        <Button w='full' variant='outline' cursor='pointer' onClick={() => router.push('/authed/parlays')}>Parlay Center</Button>
                                    </Drawer.CloseTrigger>
                                    <Drawer.CloseTrigger asChild>
                                        <Button w='full' variant='outline' cursor='pointer' onClick={() => router.push('/authed/bets')}>Bet Calculator</Button>
                                    </Drawer.CloseTrigger>
                                    <Button w='full' onClick={handleSignOut}>
                                        <LogOutIcon size={24} />
                                        Sign Out
                                    </Button>
                                </VStack>
                            </Drawer.Body>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Drawer.Root>
            </HStack>
            <VStack w='full' display={["none", "none", "none", "flex", "flex", "flex"]}>
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
            </VStack>
            {children}
        </VStack>
    )
}