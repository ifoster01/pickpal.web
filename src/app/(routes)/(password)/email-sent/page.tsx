'use client'
import { VStack } from "@/styled-system/jsx";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { css } from "@/styled-system/css";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { createClient } from "~/utils/supabase/client";
import { useState, Suspense } from "react";

const EmailSent = () => {
    const router = useRouter();
    const email = useSearchParams().get('email');
    const [emailError, setEmailError] = useState(false);

    if (!email) {
        return <Text>No email provided</Text>;
    }

    return (
        <VStack minH='screen' maxW='screen' overflow='auto' pt={8} justify='center'>
            <VStack px='10%'>
                <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={200} height={100} onClick={() => router.push('/')} className={css({ cursor: 'pointer' })} />
                <Text mt={4} fontSize='3xl'>Email Sent</Text>
                <Text fontSize='xl'>Check your email for instructions to reset your password.</Text>
                <Text>If you don&apos;t see an email in 3 minutes, please check your spam folder or try again.</Text>
                {emailError && <Text color='fg.error'>Something went wrong. Please try again.</Text>}
                <Button mt={4} px={12} onClick={async () => {
                    const supabase = createClient();
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/reset-password`,
                    })
                    if (error) {
                        setEmailError(true);
                        return;
                    }
                    router.push(`/email-sent?email=${email}`);
                }}>Resend Email</Button>
            </VStack>
        </VStack>
    )
}

export default function () {
    return (
        <Suspense fallback={<Text>Loading...</Text>}>
            <EmailSent />
        </Suspense>
    )
}