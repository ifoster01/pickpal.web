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


export default function () {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    return (
        <VStack h='screen' w='screen' justify='center'>
            <Image src={Logo} alt='Pickpal' width={200} height={200} />
            <Card.Root>
                <Card.Header textAlign='center' fontWeight='semibold' fontSize='2xl'>Log In</Card.Header>
                <Card.Body gap={2}>
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
                    <Input
                        {...register("email", { required: true })}
                        placeholder="Email..."
                    />
                    {errors.email && <Text color='red'>{errors.email.message}</Text>}
                    <Input
                        {...register("password", { required: true })}
                        placeholder="Password..."
                    />
                    {errors.password && <Text color='red'>{errors.password.message}</Text>}
                    <Button onClick={handleSubmit(async (data) => {
                        const { email, password, confirmPassword } = data;

                        if (password !== confirmPassword) {
                            // set error message
                            setError("confirmPassword", {
                                type: "manual",
                                message: "Passwords do not match!",
                            });
                        }
                        
                        const supabase = createClient();

                        const { error } = await supabase.auth.signInWithPassword({
                            email,
                            password,
                        });

                        if (error) {
                            return router.push("/login?message=Invalid username and/or password! Please try again");
                        }

                        return router.push("/authed");
                    })}>
                        Log In
                    </Button>
                    <Text textAlign='center'>Don&apos;t have an account? <Button variant='link' onClick={() => router.push("/auth/signup")}>Sign Up</Button></Text>
                </Card.Body>
            </Card.Root>
        </VStack>
    )
}