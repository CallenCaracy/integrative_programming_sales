import { Schema, Model, model, models } from "mongoose";

export interface ICart {
  cartRef: string;
  buyerId: number;
  totalPrice: number;
  items: {
    itemId: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CartSchema = new Schema<ICart>({
  cartRef: { type: String, required: true, unique: true },
  buyerId: { type: Schema.Types.Mixed, required: true },
  totalPrice: { type: Number, required: true },
  items: [
    {
      itemId: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

export const Cart: Model<ICart> =
  models.Cart || model<ICart>("Cart", CartSchema);
