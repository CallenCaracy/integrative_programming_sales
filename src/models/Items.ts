import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICategory {
  name: string;
  description: string;
  numberOfProducts: number;
  id: number;
  createdBy: string;
  createdDate: Date;
}

export interface IItem extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  categoryId: number;
  category: ICategory;
  createdBy: string;
  createdDate: Date;
}

const CategorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  numberOfProducts: { type: Number, default: 0 },
  id: { type: Number, required: true },
  createdBy: { type: String, default: "Seeder" },
  createdDate: { type: Date, default: Date.now },
});

const ItemSchema: Schema<IItem> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  categoryId: { type: Number, required: true },
  category: { type: CategorySchema, required: true },
  createdBy: { type: String, default: "Seeder" },
  createdDate: { type: Date, default: Date.now },
});

export const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);
