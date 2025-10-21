import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1) Try to sign in
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      // 2) If credentials invalid, auto-signup (instant thanks to auto-confirm)
      if (authError && (authError.message?.toLowerCase().includes("invalid") || authError.status === 400)) {
        const redirectUrl = `${window.location.origin}/admin/login`;
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (signUpError) throw signUpError;
        authData = signUpData;
      } else if (authError) {
        throw authError;
      }

      const userId = authData.user?.id;
      const userEmail = authData.user?.email;

      // 3) Ensure admin role for allowed emails (idempotent backend)
      if (userId && userEmail) {
        await supabase.functions.invoke('assign-admin-role', {
          body: { user_id: userId, email: userEmail },
        });
      }

      // 4) Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .single();

      if (roleError || !roleData) {
        await supabase.auth.signOut();
        throw new Error("Unauthorized: Admin access required");
      }

      toast({
        title: "Admin access granted",
        description: "Welcome to the admin dashboard",
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Admin Login
          </h1>
          <p className="text-foreground/70">ZAMWE Administration Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="animate-fade-in"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
