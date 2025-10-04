import { Schema, Model, Types, model, models } from "mongoose";

export interface ICart {
  cartRef: string;
  buyerId: Types.ObjectId;
  totalPrice: number;
  items: {
    item: Types.ObjectId;
    quantity: number;
    sellerId: Types.ObjectId;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CartSchema = new Schema<ICart>(
  {
    cartRef: { type: String, required: true, unique: true }, 
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalPrice: { type: Number, required: true },
    items: [
      {
        item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
        quantity: { type: Number, required: true, default: 1, min: 1 },
        sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
  },
  { timestamps: true }
);

CartSchema.index({ buyerId: 1 });
CartSchema.index({ cartRef: 1 });

export const Cart: Model<ICart> =
  models.Cart || model<ICart>("Cart", CartSchema);
