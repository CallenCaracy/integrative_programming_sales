"use client"
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const { loggedIn, user} = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (user === null) return; 
        if (!loggedIn) router.push("/login");
        else router.push("/dashboard");
    }, [router, loggedIn, user]);


    return null;
}