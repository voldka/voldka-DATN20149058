const ProductTypeService = require('../services/ProductTypeService');

const ProductTypeController = {
  create: async (req, res) => {
    try {
      const existedType = await ProductTypeService.getByName(req.body.name);
      if (existedType) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Loại sản phẩm này đã tồn tại',
        });
      }
      const newType = await ProductTypeService.create({
        name: req.body.name,
        imageUrl: `${process.env.BASE_URL}/uploads/product_types/${req.file.filename}`,
      });
      return res.status(201).json({
        status: 'OK',
        message: 'Thành công',
        statusCode: 200,
        data: {
          _id: newType._id,
          name: newType.name,
          imageUrl: newType.imageUrl,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        statusCode: error.statusCode || 500,
        message: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const types = await ProductTypeService.getAll();
      return res.status(200).json({
        statusCode: 200,
        status: 'OK',
        message: 'Thành công',
        data: types,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        statusCode: error.statusCode || 500,
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const productTypeId = req.params.productTypeId;
      if (!productTypeId) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Vui lòng cung cấp ID của loại sản phẩm',
        });
      }
      const changes = {};
      if (req.body.name) {
        changes.name = req.body.name;
      }
      if (req.file) {
        changes.imageUrl = `${process.env.BASE_URL}/uploads/product_types/${req.file.filename}`;
      }
      const response = await ProductTypeService.update(productTypeId, changes);
      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Cập nhật thành công',
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        statusCode: error.statusCode || 500,
        message: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const productTypeId = req.params.productTypeId;
      if (!productTypeId) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Vui lòng cung cấp ID của loại sản phẩm',
        });
      }
      await ProductTypeService.delete(productTypeId);
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(e.statusCode || 500).json(error);
    }
  },
};

module.exports = ProductTypeController;
