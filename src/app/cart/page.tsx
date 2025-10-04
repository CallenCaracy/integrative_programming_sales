"use client"
import CartItemCard from "@/components/cart/CartCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CartSummary({
  subtotal,
  items,
}: {
  subtotal: number;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    sellerId: string;
    images: { url: string; public_id: string }[];
  }[];
}) {
  const { user } = useAuth();
  const {clearCart} = useCart();
  const router = useRouter();
  const handleCompletePurchase = async () => {
    try {
      console.log("USER ID IN CART:", user?._id)
      const response = await fetch("/api/secure/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartRef: crypto.randomUUID(), 
          buyerId: user?._id,     
          items,
          totalPrice: subtotal,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to complete purchase: ${response.statusText}`);
      }

      const data = await response.json();
      router.push("/dashboard")
      clearCart();
      console.log("Purchase complete:", data);
      toast.success("Purchase completed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error? err.message : "Internal Server Errors");
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg shadow bg-white dark:bg-zinc-900">
      <div className="flex justify-between mb-4">
        <span className="text-lg font-medium">Subtotal</span>
        <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
      </div>
      <Button className="w-full" onClick={handleCompletePurchase}>
        Complete Purchase
      </Button>
    </div>
  );
}

export default function CartPage() {
  const { cart, removeItem } = useCart();

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground text-lg">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {cart.items.map((cartItem, index) => (
          <CartItemCard
            key={index}
            id={cartItem.itemId}
            name={cartItem.name}
            price={cartItem.price}
            quantity={cartItem.quantity}
            image={cartItem.images}
            onRemove={() => removeItem(cartItem.itemId)}
          />
        ))}
      </div>

      <CartSummary subtotal={subtotal} items={cart.items} />
    </div>
  );
}
