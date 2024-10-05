"use client";
import { VStack } from "@/styled-system/jsx";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { createClient } from "@/utils/supabase/client";

export default function () {
    const handleSignOut = async () => {
        const supabase = createClient();
        console.log('here');

        await supabase.auth.signOut();
    }

    return (
        <VStack h='full' w='full'>
            <Text fontWeight='bold' fontSize='2xl'>
                Page Title
            </Text>
            <Text>
                Page content goes here
            </Text>
            <Button onClick={handleSignOut}>
                Sign Out
            </Button>
        </VStack>
    )
}