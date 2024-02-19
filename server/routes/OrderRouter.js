const router = require('express').Router();
const OrderController = require('../controllers/OrderController');

router.post('/payment_intents', OrderController.setUpPaymentIntent);

router.route('/users/:userId').get(OrderController.getOrderByUserId);

router.route('/:orderId').patch(OrderController.updateOrder);

router.route('').get(OrderController.getAll).post(OrderController.create);

module.exports = router;
