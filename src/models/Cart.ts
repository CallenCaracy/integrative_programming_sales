import { Schema, Document, Model, Types, model, models } from "mongoose";

export interface ICart extends Document {
    cartRef: string;
    userId: Types.ObjectId;
    totalPrice: number;
    items: {
        item: Types.ObjectId; // reference to Item
        quantity: number;
    }[];
    createdAt: Date;
}

const CartSchema = new Schema<ICart>({
    cartRef: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalPrice: { type: Number, required: true },
    items: [
        {
            item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

export const Cart: Model<ICart> =
    models.Cart || model<ICart>("Cart", CartSchema);
