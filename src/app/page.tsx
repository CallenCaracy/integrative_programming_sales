"use client"
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const { authenticated, user} = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (user === null) return; 
        if (!authenticated) router.push("/login");
        else router.push("/dashboard");
    }, [router, authenticated, user]);


    return null;
}