import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle ,CardFooter} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: "Login Successful",
        description: `Welcome, ${user.name}`,
      });
      // Redirect based on role
      const role = user?.role;

      if (role === "admin") navigate("/admin");
      else if (role === "powerUser") navigate("/powerUser");
      else navigate("/user");
      


    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
    <Card className="w-full max-w-md p-6">
      <CardHeader>
        <CardTitle className="text-xl">Login to your account</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="xyz@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-xs text-center">
            Don’t have an account? <a href="/register" className="underline">Sign up</a>
          </p>
        </CardFooter>
      </form>
    </Card>
  </div>
);
}