export interface DisplayItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    sellerId: string, 
    images: { url: string; public_id: string }[];
}