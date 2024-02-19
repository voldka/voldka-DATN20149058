const Comments = require('../models/CommentProduct.model');

const getCommentsByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;

    const comments = await Comments.find({ product: productId })
      .populate({ path: 'user', select: 'name avatar' })
      .sort([['createdAt', 'desc']]);

    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      data: comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};

const create = async (req, res) => {
  try {
    const { productId, userId, content } = req.body;

    const newComment = await Comments.create({
      content,
      user: userId,
      product: productId,
    });

    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      data: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};

const update = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    const updatedComment = await Comments.findByIdAndUpdate(commentId, { content }, { new: true });

    res.json({
      status: 'success',
      statusCode: 200,
      data: updatedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};

const remove = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    await Comments.findByIdAndDelete(commentId);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};


module.exports = {
  create,
  update,
  remove,
  getCommentsByProductId,
};
