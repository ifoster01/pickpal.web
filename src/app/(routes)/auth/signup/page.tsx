"use client";
import { HStack, VStack } from "@/styled-system/jsx";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createClient } from "~/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Text } from "~/components/ui/text";
import { LabeledInput } from "~/components/general/LabaledInput";
import { Suspense, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function () {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                w='full'
                input={
                    <HStack w='full' border='1px solid' borderColor='#cfceca' borderRadius='md' pr={2}>
                        <Input
                            type={showPassword ? "text" : "password"}
                            {...register("password", { required: true })}
                            placeholder="123456789"
                            border='none'
                            _focus={{
                                boxShadow: 'none',
                            }}
                        />
                        {
                            showPassword ?
                                <EyeOff onClick={() => setShowPassword(false)} />
                                :
                                <Eye onClick={() => setShowPassword(true)} />
                        }
                    </HStack>
                }
            />
            {errors.password && <Text color='red'>{errors.password.message}</Text>}
            <LabeledInput
                label="Confirm Password"
                w='full'
                input={
                    <HStack w='full' border='1px solid' borderColor='#cfceca' borderRadius='md' pr={2}>
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword", { required: true })}
                            placeholder="123456789"
                            border='none'
                            _focus={{
                                boxShadow: 'none',
                            }}
                        />
                        {
                            showConfirmPassword ?
                                <EyeOff onClick={() => setShowConfirmPassword(false)} />
                                :
                                <Eye onClick={() => setShowConfirmPassword(true)} />
                        }
                    </HStack>
                }
            />
            {errors.confirmPassword && <Text color='red'>{errors.confirmPassword.message}</Text>}
            <HStack gap={1} flexWrap='wrap' justify='center'>
                <Text textWrap='nowrap'>
                    By clicking &quot;Sign Up&quot; (or sign in with Google),
                </Text>
                <Text>
                    you are agreeing to our
                </Text>
                <Button variant='link' fontWeight='bold' onClick={() => router.push("/privacy")}>
                    Privacy Policy
                </Button>
                <Text>
                    and
                </Text>
                <Button variant='link' fontWeight='bold' onClick={() => router.push("/tos")}>
                    Terms of Service
                </Button>
            </HStack>
            <Suspense fallback={<Text>Loading...</Text>}>
                <ParamsMessage />
            </Suspense>
            <Button w='full' mt={4} onClick={handleSubmit(async (data) => {
                const { email, password, confirmPassword } = data;

                if (password !== confirmPassword) {
                    // set error message
                    setError("confirmPassword", {
                        type: "manual",
                        message: "Passwords do not match!",
                    });
                }
                
                const supabase = createClient();

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    return router.push("/auth/signup?message=A user with that email already exists! Please try again with a different email.");
                }

                return router.push("/authed");
            })}>
                Sign Up
            </Button>
            <Text textAlign='center'>Already have an account? <Button variant='link' onClick={() => router.push("/auth/login")}>Log In</Button></Text>
        </VStack>
    )
}

function ParamsMessage() {
    const params = useSearchParams();
    return params.get('message') ? <Text color='red'>{params.get('message')}</Text> : null;
}