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
import Image from "next/image";
import { css } from "@/styled-system/css";
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
            password: "",
            confirmPassword: "",
        }
    });

    return (
        <VStack minH='screen' maxW='screen' overflow='auto' pt={8} justify='center'>
            <VStack px='10%'>
                <Image src='/logos/pickpockt long.svg' alt='Pickpockt' width={200} height={100} onClick={() => router.push('/')} className={css({ cursor: 'pointer' })} />
                <LabeledInput
                    label="Password"
                    w='full'
                    input={
                        <HStack w='full' border='1px solid' borderColor='gray.200' borderRadius='md' pr={2}>
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
                        <HStack w='full' border='1px solid' borderColor='gray.200' borderRadius='md' pr={2}>
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
                <Button w='full' mt={4} onClick={handleSubmit(async (data) => {
                    const { password, confirmPassword } = data;

                    if (password !== confirmPassword) {
                        // set error message
                        setError("confirmPassword", {
                            type: "manual",
                            message: "Passwords do not match!",
                        });
                    }
                    
                    const supabase = createClient();

                    const { error } = await supabase.auth.updateUser({
                        password: password,
                    })

                    if (error) {
                        return router.push("/forgot-password?message=A user with that email already exists! Please try again with a different email.");
                    }

                    return router.push("/auth/login");
                })}>
                    Reset Password
                </Button>
                <Text textAlign='center'>Remember your password? <Button variant='link' onClick={() => router.push("/auth/login")}>Return to Log In</Button></Text>
            </VStack>
        </VStack>
    )
}

function ParamsMessage() {
    const params = useSearchParams();
    return params.get('message') ? <Text color='red'>{params.get('message')}</Text> : null;
}