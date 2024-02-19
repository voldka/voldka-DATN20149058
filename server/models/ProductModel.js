const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: [{ type: String }],
    type: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductTypes' },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    countRating: { type: Number, default: 0 },
    description: { type: String, default: 'chưa có mô tả' },
    discount: { type: Number, default: 0 },
    selled: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);
const Product = mongoose.model('Products', productSchema);

module.exports = Product;
