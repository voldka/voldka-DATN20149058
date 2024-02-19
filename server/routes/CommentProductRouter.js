const router = require('express').Router();
const CommentController = require('../controllers/CommentProductController');

router.delete('/remove/:commentId', CommentController.remove);
router.patch('/update/:commentId', CommentController.update);
router.get('/products/:productId', CommentController.getCommentsByProductId);
router.post('/create', CommentController.create);

module.exports = router;
