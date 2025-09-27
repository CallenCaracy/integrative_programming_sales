import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  credit?: Number;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  credit: { type: Number, required: true, default: 100 },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string){
  return bcrypt.compare(candidate, this.password);
}

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
