import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['preparing', 'ready', 'delivered'],
    default: 'preparing'
  },
  razorpayDetails: {
    orderId: { type: String },
    paymentId: { type: String },
    signature: { type: String }
  },
  paymentMethod: {
    type: String,
    enum: ['gpay', 'phonepe', 'paytm', 'cash', 'razorpay'],
    default: 'cash'
  },
  estimatedDelivery: { type: Number, default: 30 }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
