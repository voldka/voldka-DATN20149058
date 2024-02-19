const CarouselModel = require('../models/CarouselModel');

const SUCCESS = 'Thành Công';

const getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const carousels = await CarouselModel.find()
        .select({ __v: 0, updatedAt: 0 })
        .sort([
          ['order', 'asc'],
          ['createdAt', 'asc'],
        ]);
      return resolve({
        status: 'success',
        statusCode: 200,
        message: SUCCESS,
        data: carousels,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

const create = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const carousel = await CarouselModel.create(data);
      return resolve({
        status: 'success',
        statusCode: 201,
        message: SUCCESS,
        data: carousel,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

const update = (carouselId, changes) => {
  return new Promise(async (resolve, reject) => {
    try {
      const carousel = await CarouselModel.findById(carouselId);
      if (!carousel) {
        return reject({
          status: 'error',
          statusCode: 404,
          message: `Không tìm thấy banner có ID: ${carouselId}`,
          data: carousel,
        });
      }
      const updatedCarousel = await CarouselModel.findByIdAndUpdate(carouselId, changes);
      return resolve({
        status: 'success',
        statusCode: 200,
        message: SUCCESS,
        data: updatedCarousel,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

const remove = (carouselId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const carousel = await CarouselModel.findById(carouselId);
      if (!carousel) {
        return reject({
          status: 'error',
          statusCode: 404,
          message: `Không tìm thấy banner có ID: ${carouselId}`,
          data: carousel,
        });
      }
      await CarouselModel.deleteOne({ _id: carouselId });
      return resolve(null);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
