const Orders = require('../models/Orders');

module.exports = {
  getOrdersByCreatedAt: (filter) => {
    return Orders.find(filter);
  },
};
