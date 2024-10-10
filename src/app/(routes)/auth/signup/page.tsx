"use client";
import { HStack, VStack } from "@/styled-system/jsx";
import { Button } from "~/components/ui/button";
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
                input={
                    <Input
                        type="password"
                        {...register("password", { required: true })}
                        placeholder="123456789"
                    />
                }
            />
            {errors.password && <Text color='red'>{errors.password.message}</Text>}
            <LabeledInput
                label="Confirm Password"
                input={
                    <Input
                        type="password"
                        {...register("confirmPassword", { required: true })}
                        placeholder="123456789"
                    />
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