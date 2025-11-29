export type CartProduct = {
  productId: string;
  name: string;
  quantity: number;
  image: string;
};

export type Cart = {
  _id: string;
  cartRef: string;
  buyerId: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items: CartProduct[];
};
