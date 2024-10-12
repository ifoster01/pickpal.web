"use client";
import { VStack } from "@/styled-system/jsx";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createClient } from "~/utils/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Text } from "~/components/ui/text";
import { LabeledInput } from "~/components/general/LabaledInput";
import { Suspense } from "react";

export default function () {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    return (
        <VStack justify='center'>
            <LabeledInput
                label="Email"
                input={
                    <Input
                        type="email"
                        {...register("email", { required: true })}
                        placeholder="test@example.com"
                    />
                }
            />
            {errors.email && <Text color='red'>{errors.email.message}</Text>}
            <LabeledInput
                label="Password"
                input={
                    <Input
                        type="password"
                        {...register("password", { required: true })}
                        placeholder="123456789"
                    />
                }
            />
            {errors.password && <Text color='red'>{errors.password.message}</Text>}
            <Suspense fallback={<Text>Loading...</Text>}>
                <ParamsMessage />
            </Suspense>
            <Button w='full' mt={4} onClick={handleSubmit(async (data) => {
                const { email, password } = data;
                console.log('here')
                
                const supabase = createClient();

                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    return router.push("/auth/login?message=Invalid username and/or password! Please try again");
                }

                return router.push("/authed");
            })}>
                Log In
            </Button>
            <Text textAlign='center'>Don&apos;t have an account? <Button variant='link' onClick={() => router.push("/auth/signup")}>Sign Up</Button></Text>
        </VStack>
    )
}

function ParamsMessage() {
    const params = useSearchParams();
    return params.get('message') ? <Text color='red'>{params.get('message')}</Text> : null;
}