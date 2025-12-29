export type CartProduct = {
  itemId: number;
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
