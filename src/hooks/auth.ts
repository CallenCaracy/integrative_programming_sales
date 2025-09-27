import { toast } from "sonner";

type AuthValues = {
  email: string;
  password: string;
  name?: string;
};

export function UseAuthHook() {
  const handleLogin = async (values: AuthValues) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || "Login failed");
      }

      return true;
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      console.error(err.message);
      return false;
    }
  };

  const handleSignup = async (values: AuthValues) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || "Signup failed");
      }

      return true;
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      console.error(err.message);
      return false;
    }
  };

  return { handleLogin, handleSignup };
}
