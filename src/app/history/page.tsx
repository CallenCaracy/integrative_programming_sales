"use client";

import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { Cart } from "@/models/types/cart";

export default function History() {
    const { user } = useAuth();
    const [pastOrders, setPastOrders] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);
    const [productMap, setProductMap] = useState<Record<string, any>>({});

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

    useEffect(() => {
    if (pastOrders.length === 0) return;

    const fetchProducts = async () => {
        const ids = new Set<number>();

        pastOrders.forEach(order =>
        order.items.forEach(item => ids.add(Number(item.itemId)))
        );

        try {
        const responses = await Promise.all(
            [...ids].map(id =>
            fetch(`/api/secure/products/${id}`).then(res => res.json())
            )
        );

        setProductMap(prev => {
            const updated = { ...prev };
            responses.forEach(res => {
            const product = res.data;
                updated[String(product.id)] = product;
            });
            console.log("Product response:", responses[0]);
            return updated;
        });
        } catch (err) {
        console.error("Failed to fetch products:", err);
        }
    };

    fetchProducts();
    }, [pastOrders]);

    if(loading) return <p className="text-gray-500">Loading past orders...</p>;
    if(pastOrders.length === 0) return <p className="text-gray-500">No past orders found.</p>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold">Order History</h2>

            {pastOrders.map((order, index) => (
            <div
                key={order.cartRef || index}
                className="border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="font-semibold text-lg">
                    Order <span className="text-gray-500">#{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    {order.items.length} items
                </span>
                </div>

                {/* Items */}
                <ul className="divide-y">
                {order.items.map((item, i) => {
                    const product = productMap[String(item.itemId)];
                    const isValidUrl = (url: string) => /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif)$/i.test(url);
                    const imageUrl = product && product.image && isValidUrl(product.image) ? product.image : "/placeholder_image.png";

                    return (
                    <li key={i} className="py-4 flex gap-4">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {product ? (
                            <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full animate-pulse bg-gray-200" />
                        )}
                        </div>

                        <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900">
                            {product ? product.name : "Loading product..."}
                            </h3>

                            {product && (
                            <span className="text-sm font-semibold text-green-600">
                                ₱{product.price.toFixed(2)}
                            </span>
                            )}
                        </div>

                        {product && (
                            <>
                            <p className="text-sm text-gray-500 mt-1">
                                {product.description}
                            </p>

                            <div className="flex gap-2 mt-2">
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                {product.category.name}
                                </span>

                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                Stock left: {product.quantity}
                                </span>
                            </div>
                            </>
                        )}

                        {!product && (
                            <div className="mt-2 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                            </div>
                        )}
                        </div>
                    </li>
                    );
                })}
                </ul>

                {/* Footer */}
                <div className="mt-5 flex justify-between items-center border-t pt-4">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="font-bold text-green-600 text-lg">
                    ₱{order.totalPrice.toFixed(2)}
                </span>
                </div>
            </div>
            ))}
        </div>
    );
}