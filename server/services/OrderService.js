const Orders = require('../models/Orders');

module.exports = {
  createOrder: (payload) => {
    return Orders.create(payload);
  },

  getOrders: (queries) => {
    return Orders.find(queries)
      .select({ __v: 0, updatedAt: 0 })
      .sort([['createdAt', 'desc']]);
  },

  getTotalOrders: (queries) => {
    return Orders.countDocuments(queries);
  },

  getOrdersByUserId: (userId) => {
    return Orders.find({ userId })
      .select({ __v: 0, updatedAt: 0 })
      .sort([['createdAt', 'desc']]);
  },

  getOrderByOrderId: (orderId) => {
    return Orders.findById(orderId);
  },

  updateOrder: (orderId, changes) => {
    return Orders.findByIdAndUpdate(orderId, changes, { new: true });
  },
};
