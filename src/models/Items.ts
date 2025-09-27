import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IItem extends Document {
    name: string;
    description: string;
    price: number;
    quantity: number;
    sellerId: Types.ObjectId;
    images: {
        url: string;
        public_id: string; // needed to delete/replace images later
    }[];
    createdAt: Date;
}

const ItemSchema: Schema<IItem> = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

export const Item: Model<IItem> =
    mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);
