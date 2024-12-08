"use client";

import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, User, KeyRound, Trash2, AlertCircle, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, signOut } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const isGoogleUser = user?.app_metadata?.provider === 'google';
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleUpdateName = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (error) throw error;
      toast.success("Name updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [fullName, supabase.auth]);

  const handleUpdatePassword = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email as string,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }

      // If current password is correct, update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword, supabase.auth, user?.email]);

  const handleDeleteAccount = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);

      // Delete user's auth account
      const { error } = await supabase.rpc('delete_user')
      if (error) throw error
      
      // After signing out, redirect to login page
      router.push('/login');
      toast.success("Account deleted successfully");

    } catch (error: any) {
      toast.error("Failed to delete account. Please try again later.");
      console.error('Delete account error:', error);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  }, [user?.id, supabase, signOut, router]);

  return (
    <div className="container max-w-4xl mx-auto px-4">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal information and how it appears on your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Input
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="max-w-md"
                  />
                  <Button
                    onClick={handleUpdateName}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Update Name"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isGoogleUser && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative w-full sm:max-w-md">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="max-w-md pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative w-full sm:max-w-md">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="relative w-full sm:max-w-md">
                        <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            ) : (
                            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            )}
                        </Button>
                    </div>
                    <Button
                      onClick={handleUpdatePassword}
                      disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isGoogleUser && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Password management is not available for Google-authenticated accounts.
                To change your password, please visit your Google Account settings.
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Delete Account
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all associated data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete Account"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 