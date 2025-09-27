import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

type AuthValues = {
  email: string;
  password: string;
  name?: string;
};

export function UseAuthHook() {
  const { login, signup, logout } = useAuth()
  const handleLogin = async (values: AuthValues) => {
    try {
      const res = await login(values.email, values.password);
      if (!res){
        toast.error("Login failed");
        throw new Error("Login failed");
      } 
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unknown error');
      console.error(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  const handleSignup = async (values: AuthValues) => {
    try {
      const res = await signup(values as { name: string; email: string; password: string });

      if (!res) {
        toast.error("Signup failed");
        throw new Error("Signup failed");
      }

      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unknown error');
      console.error(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };
  const handleLogout = async () => {
            try {
            await logout();
            return true;
        } catch (err) {
            console.error("Logout failed", err);
            toast.error(err instanceof Error ? err.message : 'Unknown error');
        }
  }

  return { handleLogin, handleSignup, handleLogout };
}
