const CarouselService = require('../services/CarouselService');
const validationSchema = require('../utils/validationSchema');

const create = async (req, res) => {
  try {
    const payload = {
      order: req.body.order,
      imageUrl: `${process.env.BASE_URL}/uploads/carousels/${req.file.filename}`,
    };
    const { error } = validationSchema.createCarouselSchemaBodyValidation(payload);
    if (error) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: error.details[0].message,
      });
    }
    const response = await CarouselService.create(payload);
    return res.status(201).json(response);
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json(e);
  }
};

const update = async (req, res) => {
  try {
    const carouselId = req.params.carouselId;
    if (!carouselId) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp ID của banner',
      });
    }
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp hình ảnh banner mới',
      });
    }
    const changes = {
      imageUrl: `${process.env.BASE_URL}/uploads/carousels/${req.file.filename}`,
    };
    const response = await CarouselService.update(carouselId, changes);
    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Cập nhật thành công',
      data: response,
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

const remove = async (req, res) => {
  try {
    const carouselId = req.params.carouselId;
    if (!carouselId) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Vui lòng cung cấp ID của banner',
      });
    }
    await CarouselService.remove(carouselId);
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(e.statusCode || 500).json(error);
  }
};

const getAll = async (req, res) => {
  try {
    const response = await CarouselService.getAll();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || 500).json(e);
  }
};

module.exports = {
  create,
  update,
  remove,
  getAll,
};
