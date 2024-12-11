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
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, setError, watch, formState: { errors } } = useForm({
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
    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      // set error message
      setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match!",
      });
      return;
    }
    
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError("password", {
        type: "manual",
        message: "Failed to update password",
      });
      return;
    }

    toast.success("Password updated successfully!");
    return router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Button
        variant="ghost"
        className="absolute top-4 left-4"
        onClick={() => router.push("/auth/login")}
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="mt-1 pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-[4px] h-9 w-9 px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Progress value={passwordStrength} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              Password strength: {passwordStrength === 100 ? "Strong" : passwordStrength >= 50 ? "Medium" : "Weak"}
            </p>
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{String(errors.password.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="mt-1 pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-[4px] h-9 w-9 px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">{errors.confirmPassword?.message as string}</p>
            )}
          </div>

          <Button className="w-full" onClick={handleSubmit(onSubmit)}>
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
}