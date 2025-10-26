"use client";

import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { Cart } from "@/models/types/cart";

export default function History() {
    const { user } = useAuth();
    const [pastOrders, setPastOrders] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!user) return;
        const fetchPastOrders = async () => {
            setLoading(true);
            try{
                const res = await fetch(`/api/secure/cart?buyerId=${user.id}`);
                if (!res.ok) throw new Error("Failed to fetch products");
                
                const json = await res.json();
                setPastOrders(Array.isArray(json.data) ? json.data : [json.data]);
            }catch(err){
                console.error("Error fetching past orders:", err);
            }finally{
                setLoading(false);
            }
        };
        fetchPastOrders();
    }, [user]);

    if(loading) return <p className="text-gray-500">Loading past orders...</p>;
    if(pastOrders.length === 0) return <p className="text-gray-500">No past orders found.</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Order History</h2>

            {pastOrders.map((order, index) => (
            <div
                key={order.cartRef || index}
                className="border rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition"
            >
                <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-lg">Order #{index + 1}</p>
                <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                </p>
                </div>

                <ul className="divide-y">
                {order.items.map((item, i) => (
                    <li key={i} className="py-3 flex items-center gap-4">
                    <img
                        src={item.image}
                        width={150}
                        height={150}
                        alt={item.name}
                        className="rounded border object-cover"
                    />
                    <div className="flex justify-between w-full">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600">x{item.quantity}</span>
                    </div>
                    </li>
                ))}
                </ul>

                <div className="mt-4 flex justify-between items-center text-gray-700">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-green-600">
                    ₱{order.totalPrice.toFixed(2)}
                </span>
                </div>
            </div>
            ))}
        </div>
    );
}