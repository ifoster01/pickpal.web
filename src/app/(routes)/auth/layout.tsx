"use client";
import { Box, HStack, VStack } from "@/styled-system/jsx";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "~/providers/AuthProvider";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { createClient } from "~/utils/supabase/client";
import Google from "public/google.colored.svg";
import Image from "next/image";
import { Text } from "~/components/ui/text";
import { css } from "@/styled-system/css";
import { IconButton } from "~/components/ui/icon-button";
import { ArrowLeftIcon } from "lucide-react";

export default function ({children}:{children: ReactNode}) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <VStack minH='screen' maxW='screen' overflow='auto' pt={8}>
            <IconButton position='absolute' top={4} left={4} variant='ghost' onClick={() => router.push('/')}>
                <ArrowLeftIcon size={24} />
            </IconButton>
            <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={200} height={100} onClick={() => router.push('/')} className={css({ cursor: 'pointer' })} />
            <VStack px='10%' w={['auto', '40%', '35%', '30%', '25%', '25%']} display={['flex', 'flex', 'flex', 'none', 'none', 'none']}>
                <Text fontSize='xl' fontWeight='semibold' textAlign='center' mb={4}>
                    {pathname === '/auth/login' ? 'Login' : 'Sign up'}
                </Text>
                <Button variant='outline' onClick={async () => {
                    const supabase = createClient();
                    const origin = window.location.origin;

                    const { data, error } = await supabase.auth.signInWithOAuth({
                        provider: "google",
                        options: {
                            redirectTo: `${origin}/auth/callback`,
                        },
                    });

                    if (error) {
                        return router.push("/login?message=An error occurred! Please try again");
                    }

                    return router.push(data.url);
                }}>
                    <Image src={Google} alt='Google' width={20} height={20} />
                    Continue with Google
                </Button>
                <HStack w='full' mt={6}>
                    <Box h='1px' w='full' bg='black' />
                    <Text>or</Text>
                    <Box h='1px' w='full' bg='black' />
                </HStack>
                {children}
            </VStack>
            <Card.Root w={['auto', '40%', '35%', '30%', '25%', '25%']} display={['none', 'none', 'none', 'flex', 'flex', 'flex']}>
                <Card.Header>
                    <Text fontSize='xl' fontWeight='semibold' textAlign='center' mb={4}>
                        {pathname === '/auth/login' ? 'Login' : 'Sign up'}
                    </Text>
                    <Button variant='outline' onClick={async () => {
                        const supabase = createClient();
                        const origin = window.location.origin;

                        const { data, error } = await supabase.auth.signInWithOAuth({
                            provider: "google",
                            options: {
                                redirectTo: `${origin}/auth/callback`,
                            },
                        });

                        if (error) {
                            return router.push("/login?message=An error occurred! Please try again");
                        }

                        return router.push(data.url);
                    }}>
                        <Image src={Google} alt='Google' width={20} height={20} />
                        Continue with Google
                    </Button>
                    <HStack w='full' mt={6}>
                        <Box h='1px' w='full' bg='black' />
                        <Text>or</Text>
                        <Box h='1px' w='full' bg='black' />
                    </HStack>
                </Card.Header>
                <Card.Body>
                    {children}
                </Card.Body>
            </Card.Root>
        </VStack>
    )
}