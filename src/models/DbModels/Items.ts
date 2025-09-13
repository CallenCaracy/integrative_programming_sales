import mongoose, { Schema, Document, Model } from "mongoose";

export interface IItem extends Document {
    name: string;
    description: string;
    sellerName: string;
    price: number;
    quantity: number;
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
    sellerName: { type: String, required: true },
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
