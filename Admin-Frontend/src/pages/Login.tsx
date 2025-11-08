"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { backend_url } from "@/config";

const Login = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    try {
      const res = await axios.post(`${backend_url}/auth/logins`, { password });

      if (res.data.success) {
        const role = res.data.role;
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("role", role);

        toast.success(res.data.message);

        if (role === "admin") navigate("/dashboard");
        else if (role === "scanner") navigate("/scanner");
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto p-3 bg-gradient-to-br from-primary to-red-700 rounded-2xl shadow-lg w-fit">
            <Film className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent">
            Tamil Film Sweden
          </CardTitle>
          <CardDescription className="text-base">
            Admin Panel Login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Admin or Scanner password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-red-700 hover:opacity-90 transition-opacity shadow-lg text-lg font-semibold"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
