const Carts = require('../models/Cart');

module.exports = {
  create: (data) => {
    return Carts.create(data);
  },

  getCartByUserId: async (userId) => {
    const cart = await Carts.findOne({ userId })
      .select({ __v: 0, updatedAt: 0 })
      .populate({
        path: 'products.productId',
        model: 'Products',
      })
      .select({ __v: 0, updatedAt: 0 })
      .sort([['createdAt', 'desc']]);
    if (cart) {
      cart._doc.products = cart.products.map((item) => {
        const { productId: productDetail, amount, image, _id } = item;
        return {
          _id,
          image,
          amount,
          productId: productDetail._doc._id,
          productName: productDetail._doc.name,
          price: productDetail.price,
          totalPrice: productDetail.price * amount,
        };
      });
    }
    return cart;
  },

  update: async (userId, changes) => {
    const updatedCart = await Carts.findOneAndUpdate({ userId }, changes, { new: true })
      .select({
        __v: 0,
        updatedAt: 0,
      })
      .populate({
        path: 'products.productId',
        model: 'Products',
      })
      .sort([['createdAt', 'desc']]);
    if (updatedCart) {
      updatedCart._doc.products = updatedCart.products.map((item) => {
        const { productId: productDetail, amount, image, _id } = item;
        return {
          _id,
          image,
          amount,
          productId: productDetail._doc._id,
          productName: productDetail._doc.name,
          price: productDetail.price,
          totalPrice: productDetail.price * amount,
        };
      });
    }
    return updatedCart;
  },
};
