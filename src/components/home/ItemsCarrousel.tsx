
import {useEffect, useState} from "react";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
interface Item {
    _id: string;
    name: string;
    sellerName: string | "default";
    description: string;
    price: number;
    quantity: number;
    images: { url: string; public_id: string }[];
}

export function ItemsCarrousel() {
const [items, setItems] = useState<Item[]>([])
const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function fetchItems() {
            try {
                setLoading(true);
                const res = await fetch("/api/items", { cache: "no-store" });
                const data = await res.json();
                setItems(data);
            } catch (err) {
                console.error("Error fetching items:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchItems();
    }, [])
    if (loading) return <p>Loading items...</p>;

    if (items.length === 0) return <p>No items available</p>;
    return (
        <div className="max-w-xl mx-auto mt-10">
            <Carousel>
                <CarouselContent>
                    {items.map((item) => (
                        <CarouselItem key={item._id} className="md:basis-1/2 lg:basis-1/3">
                            <Card className="p-2">
                                <CardContent className="flex flex-col items-center justify-center gap-2">
                                    {item.images?.[0] && (
                                        <div className="relative w-32 h-32">
                                            <Image
                                                src={item.images[0].url}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                    <p className="text-sm text-gray-500">Sold By: {item.sellerName}</p>
                                    <p className="font-bold">₱{item.price}</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}