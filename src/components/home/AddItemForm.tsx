"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function AddItemForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("/api/secure/items", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                const contentType = res.headers.get("content-type") ?? "";
                let bodyText = "";
                if (contentType.includes("application/json")) {
                    const json = await res.json();
                    bodyText = json?.error ?? json?.message ?? JSON.stringify(json);
                } else {
                    bodyText = await res.text();
                }

                throw new Error(
                    `Request failed (${res.status} ${res.statusText}) — ${bodyText}`
                );
            }

            const data = await res.json();
            // success: clear form, refresh UI, whatever you want
            form.reset(); 
            router.refresh();
        } catch (err) {
            console.error("Error submitting item:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Add a New Item</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Item Name</Label>
                        <Input id="name" name="name" required />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            className="placeholder:text-white/60"
                            id="description"
                            name="description"
                            required
                            placeholder="Add a Description"
                            rows={4} />
                    </div>

                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            step="1"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="image">Item Image</Label>
                        <Input id="image" name="image" type="file" accept="image/*" required />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Uploading..." : "Add Item"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
