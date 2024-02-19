const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarouselSchema = new Schema(
  {
    imageUrl: {
      type: Schema.Types.String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const CarouselModel = mongoose.model('Carousels', CarouselSchema);
module.exports = CarouselModel;
