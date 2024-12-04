'use client'
import { VStack } from "@/styled-system/jsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { css } from "@/styled-system/css";
import { Text } from "~/components/ui/text";
import { LabeledInput } from "~/components/general/LabaledInput";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { createClient } from "~/utils/supabase/client";

export default function () {
    const router = useRouter();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();

    return (
        <VStack minH='screen' maxW='screen' overflow='auto' pt={8} justify='center'>
            <VStack px='10%'>
                <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={200} height={100} onClick={() => router.push('/')} className={css({ cursor: 'pointer' })} />
                <Text mt={4} fontSize='3xl'>Forgot Password</Text>
                <Text textAlign={'center'}>Enter the email associated with your account and we&apos;ll send you instructions to reset your password.</Text>
                <LabeledInput
                    label="Email"
                    input={
                        <Input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="example@email.com"
                        />
                    }
                />
                {errors.email && <Text color='red'>{String(errors.email.message)}</Text>}
                <Button w='full' onClick={handleSubmit(async (data) => {
                    const { email } = data;
                    const supabase = createClient();
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/reset-password`,
                    })
                    if (error) {
                        setError("email", {
                            type: "manual",
                            message: "Invalid email address! Please try again",
                        });
                        return;
                    }
                    router.push(`/email-sent?email=${email}`);
                })}>Reset Password</Button>
            </VStack>
        </VStack>
    )
}
