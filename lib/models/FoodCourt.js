import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const MenuItemSchema = new Schema({
  id: { type: String, required: true },
  category: { type: String, required: true },
  foodName: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  description: { type: String }
});

const ShopSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  emoji: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  timeLabel: { type: String },
  tag: { type: String },
  coverImage: { type: String },
  items: [MenuItemSchema]
});

const FoodCourtSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: { type: String },
  emoji: { type: String },
  badge: { type: String },
  badgeColor: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  distance: { type: String },
  image: { type: String },
  shops: [ShopSchema]
}, { timestamps: true });

export default mongoose.models.FoodCourt || mongoose.model('FoodCourt', FoodCourtSchema);
