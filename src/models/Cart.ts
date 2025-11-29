import { Schema, Model, model, models } from "mongoose";

export interface ICart {
  cartRef: string;
  buyerId: number;
  totalPrice: number;
  items: {
    itemId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    seller: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CartSchema = new Schema<ICart>({
  cartRef: { type: String, required: true, unique: true },
  buyerId: { type: Schema.Types.Mixed, required: true }, // string or number
  totalPrice: { type: Number, required: true },
  items: [
    {
      itemId: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1, min: 1 },
      seller: { type: String, required: true },
    },
  ],
}, { timestamps: true });

export const Cart: Model<ICart> =
  models.Cart || model<ICart>("Cart", CartSchema);
