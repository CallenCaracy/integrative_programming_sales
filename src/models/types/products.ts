export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
    description: string;
    numberOfProducts: number;
    createdBy: string;
    createdDate: string;
  };
  createdBy: string;
  createdDate: string;
}