"use client"
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        router.push('/dashboard');
    }, [router, isLoggedIn]);

    return null;
}