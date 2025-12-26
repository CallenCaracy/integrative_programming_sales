import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

type AuthValues = {
  username: string;
  password: string;
};

export function UseAuthHook() {
  const { login, logout } = useAuth();

  const handleLogin = async (values: AuthValues): Promise<boolean> => {
    try {
      const success = await login(values.username, values.password);
      if (!success) {
        toast.error("Login failed");
        return false;
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(message);
      console.error(message);
      return false;
    }
  };

  const handleLogout = async (): Promise<boolean> => {
    try {
      await logout();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(message);
      console.error("Logout failed", message);
      return false;
    }
  };

  return { handleLogin, handleLogout };
}
