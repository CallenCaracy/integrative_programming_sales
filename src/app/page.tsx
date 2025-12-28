"use client"
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const { authenticated, user} = useAuth();
    const router = useRouter();
    useEffect(() => { 
        if (!authenticated || !user) router.push("/login");
        else router.push("/dashboard");
    }, [router, authenticated, user]);


    return null;
}