const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['thanh toán khi nhận hàng', 'thẻ tín dụng', 'thanh toán tại của hàng'],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['chưa thanh toán', 'đã thanh toán', 'đã hoàn tiền'],
    },
    deliveryStatus: {
      type: String,
      required: true,
      enum: ['đang giao hàng', 'đã giao hàng', 'giao hàng thất bại'],
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['thành công', 'đã huỷ', 'đang xử lý'],
      default: 'đang xử lý',
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        productName: { type: String, required: true },
        amount: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],
    promotions: [
      {
        promotionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        title: { type: String },
        discountValue: { type: Number },
      },
    ],
    totalBill: { type: Number, required: true },
    notes: { type: String },
    fullName: { type: String },
    phone: { type: String },
    deliveryAddress: { type: String },
    isRated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;
