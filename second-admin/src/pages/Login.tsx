"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import axios from "axios";
import { backend_url } from "@/config";


const Login = () => {
  const API_URL = backend_url;
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [collectorType, setCollectorType] = useState("video speed");

  // 👇 new state for backend collector options
  const [collectorOptions, setCollectorOptions] = useState<
    { _id: string; name: string; description?: string }[]
  >([]);
  const [selectedCollector, setSelectedCollector] = useState("");

  const navigate = useNavigate();

  // 👇 fetch collector options when "Others" clicked
  useEffect(() => {
    if (collectorType === "others") {
      axios
        .get(`${API_URL}/collectors/getcollectors`)
        .then((res) => {
          const list = res.data.collectors || [];
          setCollectorOptions(list);
          if (list.length > 0) setSelectedCollector(list[0].name);
        })
        .catch(() => toast.error("Failed to load collector options"));
    }
  }, [collectorType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || (!isLogin && (!phone || !email || !address))) {
      toast.error("Please fill all fields");
      return;
    }

    // 🟡 Ensure collector selected if "others"
    if (!isLogin && collectorType === "others" && !selectedCollector) {
      toast.error("Please select a collector type");
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, {
          username,
          password,
        });

        toast.success(res.data.message || "Login successful");

        sessionStorage.setItem("loggedIn", "true");
        localStorage.setItem("id", res.data.userId);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem(
          "collectorType",
          res.data.collectorType || collectorType
        );
        localStorage.setItem("access", res.data.access);

        navigate("/dashboard");
      } else {
        const finalCollectorType =
          collectorType === "others" ? selectedCollector : collectorType;

        console.log("Register payload:", {
          username,
          password,
          phone,
          email,
          address,
          collectorType: finalCollectorType,
        });

        const res = await axios.post(`${API_URL}/auth/register`, {
          username,
          password,
          phone,
          email,
          address,
          collectorType: finalCollectorType,
        });

        toast.success(res.data.message || "Registered successfully");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
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
            {isLogin ? "Admin Panel Login" : "Create an Account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-11"
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ticket Collector</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setCollectorType("video speed")}
                      className={`w-1/2 h-11 ${
                        collectorType === "video speed"
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      Video Speed
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCollectorType("others")}
                      className={`w-1/2 h-11 ${
                        collectorType === "others"
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      Others
                    </Button>
                  </div>
                </div>

                {/* 👇 Show backend collector options if "Others" is selected */}
                {collectorType === "others" && (
                  <div className="space-y-2 mt-2">
                    <Label>Select Collector Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {collectorOptions.length > 0 ? (
                        collectorOptions.map((collector) => (
                          <Button
                            key={collector._id}
                            type="button"
                            onClick={() => {
                              setSelectedCollector(collector.name);
                              toast.success(
                                `Selected collector: ${collector.name}`
                              );
                            }}
                            className={`h-10 ${
                              selectedCollector === collector.name
                                ? "bg-primary text-white border border-primary"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            {collector.name}
                          </Button>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Loading options...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-red-700 hover:opacity-90 transition-opacity shadow-lg text-lg font-semibold"
            >
              {isLogin ? "Login" : "Register"}
            </Button>

            <div className="text-center pt-3">
              {isLogin ? (
                <p className="text-sm">
                  Don’t have an account?{" "}
                  <span
                    className="text-primary font-semibold cursor-pointer"
                    onClick={() => setIsLogin(false)}
                  >
                    Register
                  </span>
                </p>
              ) : (
                <p className="text-sm">
                  Already have an account?{" "}
                  <span
                    className="text-primary font-semibold cursor-pointer"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </span>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
