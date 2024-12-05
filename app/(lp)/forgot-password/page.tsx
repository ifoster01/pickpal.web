"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEmailSent(true);
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
          <h1 className="text-3xl font-bold">Reset Password</h1>
          { !isEmailSent && <p className="text-muted-foreground mt-2">
            Enter your email to receive a password reset link
          </p> }
        </div>

        <AnimatePresence mode="wait">
          {!isEmailSent ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message as string}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Check Your Email</h3>
              <p className="text-muted-foreground">
                We've sent a password reset link to your email address.
                Please check your inbox and follow the instructions.
              </p>
              <p className="text-muted-foreground">
                (You can close this page)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}