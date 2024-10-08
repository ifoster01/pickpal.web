"use client";
import { VStack } from "@/styled-system/jsx";
import Image from "next/image";
import Logo from "public/logos/pickpockt long.svg";
import Google from "public/google.colored.svg";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Text } from "~/components/ui/text";
import { LabeledInput } from "~/components/general/LabaledInput";


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