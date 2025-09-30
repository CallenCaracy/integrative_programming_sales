import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddItemButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="rounded-full shadow-lg hover:scale-105 transition-transform"
      size="icon"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
