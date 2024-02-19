const CommentModel = require('../models/CommentProduct.model');

const createComment = (data) => {
  return new Promise(async (resolve, reject) => {
    const { product, user, content, images } = data;
    try {
      const newComment = new CommentModel({
        product: product,
        user: user,
        content: content,
        image: images, // Array of image paths if available
      });
      let rs = newComment.save();
      if (rs) {
        resolve({
          status: 'OK',
          message: 'Thành công',
          data: {
            total: null,
            pageCurrent: null,
            totalPage: null,

            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: newComment,
          },
          access_token: null,
          refresh_token: null,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const updateComment = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkComment = await CommentModel.findOne({
        _id: id,
      });
      if (checkComment === null) {
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
      } else if (checkComment.user != data?.user) {
        resolve({
          status: 'ERR',
          message: 'Không thế sửa đổi bình luận của người khác',
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
      const updateComment = await CommentModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: null,
          pageCurrent: null,
          totalPage: null,
          userData: null,
          productData: null,
          orderData: null,
          carouselData: null,
          commentData: updateComment,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const deleteComment = (commentId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkComment = await CommentModel.findOne({
        _id: commentId,
      });
      if (checkComment === null) {
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
      } else if (checkComment.user != userId) {
        resolve({
          status: 'ERR',
          message: 'Không thể xóa bình luận của người khác',
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

      await CommentModel.findByIdAndDelete(commentId);
      resolve({
        status: 'OK',
        message: 'Xóa thành công',
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
    } catch (error) {}
  });
};
const getCommentsOfProduct = (id, limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comments = CommentModel.find({ product: id });
      let totalComments = (await comments).length;
      let allComments = [];
      if (filter) {
        const label = filter[0];
        const allObjectFilter = await CommentModel.find({
          [label]: { $regex: filter[1] },
          product: id,
        })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: 'OK',
          message: 'Thành công',
          data: {
            total: totalComments,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalComments / limit),
            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: allObjectFilter,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allCommentSort = await CommentModel.find({ product: id })
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: 'OK',
          message: 'Thành công',
          data: {
            total: totalComments,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalComments / limit),

            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: allCommentSort,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      if (!limit) {
        allComments = await CommentModel.find({ product: id }).sort({
          createdAt: -1,
          updatedAt: -1,
        });
      } else {
        allComments = await CommentModel.find({ product: id })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: totalComments,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalComments / limit),

          userData: null,
          productData: null,
          orderData: null,
          carouselData: null,
          commentData: allComments,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (error) {
      reject(e);
    }
  });
};
const getCommentOfUser = (id, limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comments = CommentModel.find({ user: id });
      let totalComments = (await comments).length;
      let allComments = [];
      if (filter) {
        const label = filter[0];
        const allObjectFilter = await CommentModel.find({
          [label]: { $regex: filter[1] },
          user: id,
        })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: 'OK',
          message: 'Thành công',
          data: {
            total: totalComments,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalComments / limit),

            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: allObjectFilter,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allCommentSort = await CommentModel.find({ user: id })
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: 'OK',
          message: 'Thành công',
          data: {
            total: totalComments,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalComments / limit),
            userData: null,
            productData: null,
            orderData: null,
            carouselData: null,
            commentData: allCommentSort,
          },
          access_token: null,
          refresh_token: null,
        });
      }
      if (!limit) {
        allComments = await CommentModel.find({ user: id }).sort({
          createdAt: -1,
          updatedAt: -1,
        });
      } else {
        allComments = await CommentModel.find({ user: id })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: {
          total: totalComments,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalComments / limit),
          userData: null,
          productData: null,
          carouselData: null,
          orderData: null,
          commentData: allComments,
        },
        access_token: null,
        refresh_token: null,
      });
    } catch (error) {
      reject(e);
    }
  });
};
module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentsOfProduct,
  getCommentOfUser,
};
