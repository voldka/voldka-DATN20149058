const CartService = require('../services/CartService');

module.exports = {
  getCartByUserId: async (req, res) => {
    try {
      let cart = await CartService.getCartByUserId(req.params.userId);
      if (!cart) {
        cart = await CartService.create({
          user: req.params.userId,
          products: [],
        });
      }
      return res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: cart,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      // Preprocessing data
      const currentCart = await CartService.getCartByUserId(req.params.userId);
      if (!currentCart) {
        return res.status(404).json({
          status: 'error',
          statusCode: 404,
          message: 'Không tìm thấy giỏ hàng',
        });
      }
      const { products } = req.body;

      const newProducts = products.filter((product) => {
        return !currentCart.products.find(
          (item) =>
            item.productId.toString() === product.productId.toString() &&
            item.size === product.size,
        );
      });

      const changedProducts = currentCart.products.reduce((results, currentProduct) => {
        delete currentProduct._id;
        const changedProduct = products.find(
          (prod) => prod.productId.toString() === currentProduct.productId.toString(),
        );
        if (!changedProduct) {
          results.push(currentProduct);
        } else if (changedProduct.amount) {
          currentProduct.amount += parseInt(changedProduct.amount);
          results.push(currentProduct);
        }
        return results;
      }, []);

      const updatedCart = await CartService.update(req.params.userId, {
        products: [...changedProducts, ...newProducts],
      });

      return res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: updatedCart,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: error.message,
      });
    }
  },
};
