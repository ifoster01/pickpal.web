"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const router = useRouter();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const password = watch("password", "");
  const passwordStrength = calculatePasswordStrength(password);

  const onSubmit = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Button
        variant="ghost"
        className="absolute top-4 left-4"
        onClick={() => router.push("/login")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Login
      </Button>

      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Set New Password</h1>
          <p className="text-muted-foreground mt-2">
            Please enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="mt-1"
            />
            <Progress value={passwordStrength} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              Password strength: {passwordStrength === 100 ? "Strong" : passwordStrength >= 50 ? "Medium" : "Weak"}
            </p>
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password?.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="mt-1"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">{errors.confirmPassword?.message as string}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
}