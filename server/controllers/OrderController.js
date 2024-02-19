const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CartService = require('./../services/CartService');
const OrderService = require('../services/OrderService');
const UserService = require('./../services/UserService');
const Product = require('../models/ProductModel');
const { sendEmail } = require('../utils/SendEmail');
const { createOrderSuccessFullyMailTemplate } = require('../mail/create-order-successfully');

const setUpPaymentIntent = async (req, res, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: +req.body.totalBill,
      currency: 'vnd',
      payment_method_types: ['card'],
    });
    return res.status(201).json({
      status: 'success',
      statusCode: 201,
      message: 'Created',
      data: paymentIntent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: error.message,
    });
  }
};

const create = async (req, res, next) => {
  try {
    let promises = [];
    // Check cart
    const cart = await CartService.getCartByUserId();
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Không tìm thấy người dùng có ID: ${req.body.userId}`,
      });
    }
    // Check user
    const user = await UserService.getDetailsUser(req.body.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Không tìm thấy người dùng có ID: ${req.body.userId}`,
      });
    }
    // Check products
    const productIds = req.body.products.map((product) => product.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    if (!productIds.length) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Giỏ hàng của bạn đang trống',
      });
    }
    // Check countInStock
    for (let currentProduct of req.body.products) {
      const placingProduct = products.find(
        (item) => item._id.toString() === currentProduct.productId,
      );
      if (!placingProduct) {
        return res.status(404).json({
          status: 'error',
          statusCode: 404,
          message: `Không tìm thấy sản phẩm có ID: ${currentProduct.productId}`,
        });
      }
      if (placingProduct.countInStock < currentProduct.amount) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: `Sản phẩm ${placingProduct.name} có số lượng còn lại không đủ, hiện chỉ còn ${placingProduct.countInStock}`,
        });
      }
   
      promises.push(OrderService.createOrder(req.body));
      promises.push(
        Product.updateOne(
          { _id: placingProduct._id.toString() },
          { countInStock: placingProduct.countInStock - currentProduct.amount },
        ),
      );
    }
    promises.push(CartService.update(req.body.userId, { products: [] }));
    const mailTpl = createOrderSuccessFullyMailTemplate(req.body);
    promises.push(sendEmail(user.email, 'LT - Handmade - Tạo đơn hàng thành công', mailTpl));

    const [order] = await Promise.all(promises);
    return res.status(201).json({
      status: 'success',
      statusCode: 201,
      message: 'Đặt hàng thành công',
      data: { orderId: order._id },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: error.message,
    });
  }
};

const getAll = async (req, res, next) => {
  try {
    const filterObj = Object.keys(req.query).reduce((results, field) => {
      const val = req.query[field];
      if (val) {
        results[field] = val;
      }
      return results;
    }, {});

    const queries = {};
    for (const field in filterObj) {
      switch (field) {
        case 'search':
          const regex = new RegExp(req.query[field], 'i');
          queries['$or'] = [{ fullName: regex }, { phone: regex }];
          break;
        case 'fullName':
          queries[field] = { $regex: new RegExp(req.query[field], 'i') };
          break;
        case 'phone':
          queries[field] = req.query[field];
          break;
        case 'paymentMethod':
          queries[field] = req.query[field];
          break;
        case 'paymentStatus':
          queries[field] = req.query[field];
          break;
        case 'deliveryStatus':
          queries[field] = req.query[field];
          break;
        case 'orderStatus':
          queries[field] = req.query[field];
          break;
        case 'startDate': {
          const date = moment(req.query.startDate).utc().startOf('day').toDate();
          if (queries.createdAt) {
            queries.createdAt.$gte = date;
          } else {
            queries.createdAt = { $gte: date };
          }
          break;
        }
        case 'endDate': {
          const date = moment(req.query.endDate).utc().endOf('day').toDate();
          if (queries.createdAt) {
            queries.createdAt.$lte = date;
          }
          queries.createdAt = { $lte: date };
          break;
        }
        default:
          return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: `Không hỗ trợ tìm kiếm đơn hàng theo trường: ${field}`,
          });
      }
    }

    const orders = await OrderService.getOrders(queries);

    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'OK',
      data: orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: error.message,
    });
  }
};

const getOrderByUserId = async (req, res, next) => {
  try {
    const user = await UserService.getDetailsUser(req.params.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Không tìm thấy người dùng có ID: ${req.params.userId}`,
      });
    }

    const orders = await OrderService.getOrdersByUserId(req.params.userId);
    return res.status(200).json({
      status: 'OK',
      statusCode: 200,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const order = await OrderService.getOrderByOrderId(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Không tìm thấy đơn hàng với mã: ${req.params.orderId}`,
      });
    }

    const fields = Object.keys(req.body);
    if (!fields.length) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp thông tin bạn muốn cập nhật cho đơn hàng',
      });
    }

    const changes = {};
    for (const field of fields) {
      switch (field) {
        case 'paymentStatus': {
          changes.paymentStatus = req.body.paymentStatus;
          break;
        }
        case 'deliveryStatus': {
          changes.deliveryStatus = req.body.deliveryStatus;
          break;
        }
        case 'orderStatus': {
          changes.orderStatus = req.body.orderStatus;
          break;
        }
        case 'notes': {
          changes.notes = req.body.notes;
          break;
        }
        case 'isRated': {
          changes.isRated = req.body.isRated;
          break;
        }
      }
    }
    const promises = [];

    promises.push(
      OrderService.updateOrder(req.params.orderId, {
        ...changes,
        createdAt: new Date(),
      }),
    );

    if (changes.orderStatus === 'đã huỷ') {
      const productIds = order.products.map((prod) => prod.productId.toString());
      const dbProducts = await Product.find({ _id: { $in: productIds } });
      for (let orderProduct of order.products) {
        const dbProduct = dbProducts.find(
          (item) => item._id.toString() === orderProduct.productId.toString(),
        );
        if (!dbProduct) {
          return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: `Không tìm thấy sản phẩm có ID: ${dbProduct._id}`,
          });
        }
        promises.push(
          Product.updateOne(
            { _id: dbProduct._id.toString() },
            { countInStock: dbProduct.countInStock + orderProduct.amount },
          ),
        );
      }
    }

    const [updatedOrder] = await Promise.all(promises);

    return res.status(200).json({
      status: 'Update',
      statusCode: 200,
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports = {
  setUpPaymentIntent,
  create,
  getAll,
  getOrderByUserId,
  updateOrder,
};
