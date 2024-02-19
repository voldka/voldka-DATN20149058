const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
        amount: { type: Number, required: true },
        image: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Carts = mongoose.model('Carts', cartSchema);
module.exports = Carts;
