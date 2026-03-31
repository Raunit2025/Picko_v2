import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMenuItem {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image?: string;
  emoji?: string;
  tags?: string[];
}

export interface IShop {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image?: string;
  rating?: number;
  items: IMenuItem[];
}

export interface IFoodCourt extends Document {
  name: string;
  location: string;
  shops: IShop[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: "" },
  emoji: { type: String, default: "🍽️" },
  tags: { type: [String], default: [] },
});

const ShopSchema = new Schema<IShop>({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  items: { type: [MenuItemSchema], default: [] },
});

const FoodCourtSchema = new Schema<IFoodCourt>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    shops: { type: [ShopSchema], default: [] },
  },
  { 
    timestamps: true 
  }
);

const FoodCourt: Model<IFoodCourt> = mongoose.models.FoodCourt || mongoose.model<IFoodCourt>("FoodCourt", FoodCourtSchema);

export default FoodCourt;