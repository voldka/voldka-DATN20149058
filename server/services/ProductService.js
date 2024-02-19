const Product = require('../models/ProductModel');

const createProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        name: data.name,
      });
      if (checkProduct !== null) {
        return reject({
          status: 'error',
          statusCode: 400,
          message: 'Tên sản phẩm đã tồn tại',
        });
      }
      const newProduct = await Product.create(data);
      return resolve(newProduct);
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [currentProduct, existedProduct] = await Promise.all([
        Product.findById(id),
        Product.findOne({ name: { $regex: new RegExp('^' + data.name + '$', 'i') } }),
      ]);
      if (!currentProduct) {
        return reject({
          status: 'error',
          statusCode: 404,
          message: `Không tìm thấy sản phẩm có ID: ${id}`,
        });
      }
      if (existedProduct && existedProduct._id.toString() !== id) {
        return reject({
          status: 'error',
          statusCode: 404,
          message: `Sản phẩm đã tồn tại`,
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      }).select({ __v: 0, updatedAt: 0 });
      return resolve(updatedProduct);
    } catch (error) {
      return reject(error);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: 'ERR',
          message: 'Không tìm thấy',
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,
            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: null,
          },
          access_token: null,
          refresh_token: null,
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: 'OK',
        message: 'Delete product Thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: null,
          carouselData: null,
          commentData: null,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: 'OK',
        message: 'Delete product Thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: null,
          carouselData: null,
          commentData: null,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(id).populate('type');
      if (!product) {
        return reject({
          status: 'error',
          statusCode: 404,
          message: `Không tìm thấy sản phẩm có ID: ${id}`,
        });
      }
      return resolve(product);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (filter, page, pageSize) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments(filter);
      const allProducts = await Product.find(filter)
        .populate('type')
        .limit(parseInt(pageSize, 10))
        .skip((page - 1) * pageSize)
        .sort({ createdAt: -1, updatedAt: -1 });

      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: totalProduct,
          pageCurrent: Number(page),
          totalPage: Math.ceil(totalProduct / pageSize),
          productData: allProducts,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve([]);
    } catch (e) {
      return reject(e);
    }
  });
};

const getRelevantProducts = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return reject({
          status: 'error',
          statusCode: 404,
          message: `Không tìm thấy sản phẩm có ID: ${id}`,
        });
      }

      const productType = product.type;

      const revelations = await Product.find({
        _id: { $ne: productId }, // Exclude the current product
        type: productType,
      }).limit(10);

      return resolve(revelations);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
  getRelevantProducts,
};
