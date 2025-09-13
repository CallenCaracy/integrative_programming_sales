"use client"

import {AddItemForm} from "@/components/home/AddItemForm";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {ItemsCarrousel} from "@/components/home/ItemsCarrousel";

export default function Home() {
    const [formShowed, setFormShowed] = useState<boolean>(false);

    const handleFormShow = (show: boolean) => {
        setFormShowed(show);
    }

    return (
        <div className="bg-accent/20 max-w-full h-screen flex flex-col p-4">
            <div className="flex justify-center items-center">
                <h1 className="text-6xl">WELCOME TO CLARENCE SUPERMARKET</h1>
            </div>
            {!formShowed && (
                <div className="flex justify-end p-6">
                    <Button onClick={()=> handleFormShow(true)}>
                        <Plus className="w-5 h-5 " />
                    </Button>
                </div>
            )}
            {formShowed && (
                <div className="relative max-w-lg mx-auto mt-6">
                    <button
                        onClick={() => handleFormShow(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <AddItemForm />
                </div>
            )}
            <div className="flex justify-center items-end p-6">
                <ItemsCarrousel />
            </div>
        </div>
    )
}