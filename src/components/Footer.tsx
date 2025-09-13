import Image from "next/image";
import logo from "../../public/assets/shopping_cart.svg";

export default function Footer() {
    return (
        <footer className="mt-16 flex flex-row items-center gap-4 bg-gray-800 rounded-md p-10">
                <Image src={logo} alt="logo" width={42} height={42} className="w-12 h-12 " />
                <p className="text-md font-medium md:block hidden text-xl text-white">CLARENCE SUPERMARKET
                    <span className="text-accent">.</span></p>
                <p className="text-white/20">Integrative Programming Final Project 2025</p>
        </footer>
    )
}