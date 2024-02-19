const router = require('express').Router();
const CartController = require('../controllers/CartController');

router.route('/users/:userId').get(CartController.getCartByUserId).patch(CartController.update);

module.exports = router;
