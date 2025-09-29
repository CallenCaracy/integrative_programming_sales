"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/authContext"; 

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be > 0"),
  quantity: z.number().int().positive("Quantity must be > 0"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export function AddItemForm() {
  const { user } = useAuth();
  const sellerId = user?._id; 
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 1,
      image: undefined,
    },
  });

  async function onSubmit(values: ItemFormValues) {
    if (!sellerId) {
      console.error("No sellerId found, user not logged in?");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      formData.append("quantity", values.quantity.toString());
      formData.append("image", values.image);
      formData.append("sellerId", sellerId); 

      const res = await fetch("/api/secure/items", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error ?? "Failed to create item");
      }

      const data = await res.json();
      console.log("Item created:", data);

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
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a description" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    {...field} 
                    onChange={e => field.onChange(Number(e.target.value))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                    type="number" 
                    step="1" 
                    min="1" {...field} 
                    onChange={e => field.onChange(Number(e.target.value))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          field.onChange(e.target.files[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Uploading..." : "Add Item"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
