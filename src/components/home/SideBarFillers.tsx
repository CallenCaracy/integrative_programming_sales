"use client";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "../ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Chat } from "../Chat";

type Props = {
  onPriceChange?: (price: number) => void;
};

export default function SidebarFilters({ onPriceChange }: Props) {
  const [value, setValue] = useState([300]);

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <Slider
          value={value}
          onValueChange={(val) => {
            setValue(val);
            onPriceChange?.(val[0]);
          }}
          max={1130}
          min={20}
          step={10}
        />
        <p className="text-sm text-muted-foreground">
          Price range: $0 - ${value[0]}
        </p>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-2">Star Rating</h3>
        <RadioGroup defaultValue="4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id="4stars" />
            <Label htmlFor="4stars">4 stars & up</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-2">Brand</h3>
        {["Adidas", "Nike", "Columbia", "Xiaomi"].map((brand) => (
          <div key={brand} className="flex items-center space-x-2">
            <Checkbox id={brand} />
            <Label htmlFor={brand}>{brand}</Label>
          </div>
        ))}
      </div>

      <Separator />
      <div>
        <h3 className="font-semibold mb-2">Delivery Options</h3>
        <RadioGroup defaultValue="standard">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard">Standard</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup">Pick Up</Label>
          </div>
        </RadioGroup>
      </div>
      <Separator />
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-white hover:bg-accent text-black cursor-pointer">
            <span className="text-xl">Contact Kentward</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="center" className="p-4">
          <VisuallyHidden>
            <SheetHeader>
              <SheetTitle>Chat</SheetTitle>
            </SheetHeader>
          </VisuallyHidden>
          <div>
            <Chat />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
