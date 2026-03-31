import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IOrderItem {
  foodName: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  orderStatus: "preparing" | "ready" | "delivered";
  paymentMethod: "cash" | "online";
  paymentStatus: "pending" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(val: IOrderItem[]) => val.length > 0, "Order must have at least one item"]
    },
    totalAmount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    orderStatus: {
      type: String,
      enum: ["preparing", "ready", "delivered"],
      default: "preparing",
    },
    paymentMethod: { 
      type: String, 
      enum: ["cash", "online"], 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid"], 
      default: "pending" 
    },
  },
  { 
    timestamps: true 
  }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;