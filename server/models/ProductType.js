const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  },
);

const ProductTypes = mongoose.model('ProductTypes', productTypeSchema);
module.exports = ProductTypes;
