"use client";
import { VStack } from "@/styled-system/jsx";
import { createClient } from "@/utils/supabase/client";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function () {
    const propsTest = async () => {
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
        // print out json data in a pretty format
        console.log(JSON.stringify(data, null, 2));
    }

    return (
        <VStack h='full' w='full'>
            <Text fontWeight='bold' fontSize='2xl'>
                Bet Calculator
            </Text>
            {/* <Button onClick={() => propsTest()}>
                Test
            </Button> */}
            <Text>
                Coming soon...
            </Text>
        </VStack>
    )
}