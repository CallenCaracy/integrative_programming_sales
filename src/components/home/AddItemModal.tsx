import { X } from "lucide-react";
import { AddItemForm } from "@/components/home/AddItemForm";

export default function AddItemModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative max-w-lg w-full mx-auto mt-6 p-6 rounded-2xl shadow-lg 
                    bg-white dark:bg-zinc-900">
      <button
        title="Close"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 
                   dark:hover:text-gray-200 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
      <AddItemForm />
    </div>
  );
}
