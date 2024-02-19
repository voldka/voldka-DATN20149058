const ProductTypes = require('../models/ProductType');

module.exports = {
  create: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const carousel = await ProductTypes.create(data);
        return resolve(carousel);
      } catch (error) {
        return reject(error);
      }
    });
  },

  getByName: (name) => {
    return new Promise(async (resolve, reject) => {
      try {
        const carousel = await ProductTypes.findOne({
          name: { $regex: new RegExp('^' + name + '$', 'i') },
        });
        return resolve(carousel);
      } catch (error) {
        return reject(error);
      }
    });
  },

  getAll: () => {
    return ProductTypes.find()
      .select({ __v: 0, updatedAt: 0 })
      .sort([['createdAt', 'desc']]);
  },

  update: (id, changes) => {
    return new Promise(async (resolve, reject) => {
      try {
        const [currentProductType, existedProductType] = await Promise.all([
          ProductTypes.findById(id),
          ProductTypes.findOne({ name: { $regex: new RegExp('^' + changes.name + '$', 'i') } }),
        ]);
        if (!currentProductType) {
          return reject({
            status: 'error',
            statusCode: 404,
            message: `Không tìm thấy loại sản phẩm có ID: ${id}`,
          });
        }
        if (existedProductType && existedProductType._id.toString() !== id) {
          return reject({
            status: 'error',
            statusCode: 404,
            message: `Loại sản phẩm đã tồn tại`,
          });
        }

        const updatedProductType = await ProductTypes.findByIdAndUpdate(id, changes, {
          new: true,
        }).select({ __v: 0, updatedAt: 0 });
        return resolve(updatedProductType);
      } catch (error) {
        return reject(error);
      }
    });
  },

  delete: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const prodType = await ProductTypes.findById(id);
        if (!prodType) {
          return reject({
            status: 'error',
            statusCode: 404,
            message: `Không tìm thấy loại sản phẩm có ID: ${id}`,
          });
        }
        await ProductTypes.deleteOne({ _id: id });
        resolve(null);
      } catch (error) {
        return reject(error);
      }
    });
  },
};
