"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/../public/assets/shopping_cart.svg"
import {AiOutlineShoppingCart} from "react-icons/ai";
import {Button} from "@/components/ui/button";
import { UseAuthHook } from "@/hooks/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const { handleLogout } = UseAuthHook();
    const onLogout = async () => {
        await handleLogout();
        router.push('/login');
    }    


    return (
        <nav className="w-full flex items-center justify-between border-b border-gray-500">
            <Link href="/" className="flex items-center">
                <div className="flex flex-row items-center gap-4">
                    <Image src={logo} alt="logo" width={200} height={200} className="w-18 h-18 " />
                    <p className="text-md font-medium md:block hidden text-3xl">CLARENCE SUPERMARKET
                        <span className="text-accent">.</span></p>
                </div>
            </Link>
            <div className="flex flex-row items-center gap-4">
                <div>
                    <AiOutlineShoppingCart  className="text-3xl hover:text-accent" />
                </div>
                <Button className="bg-white text-black hover:bg-accent w-30 h-14 text-xl">
                    <a href="/dashboard" className="text-black">
                        Dashboard
                    </a>
                </Button>
                <Button className="bg-white text-black hover:bg-accent w-30 h-14 text-xl">
                    <a href="/profile" className="text-black">
                        Profile
                    </a>
                </Button>
                <Button
                    onClick={onLogout}
                    className="bg-white text-black hover:bg-accent w-30 h-14 text-xl"
                    >
                    Logout
                </Button>
            </div>
        </nav>
    )
}