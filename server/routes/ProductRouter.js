const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const generateFilename = require('../utils/generateFilename');
const ProductController = require('../controllers/ProductController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = path.resolve(__dirname, '../', '../', 'public', 'uploads', 'products');
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const filename = generateFilename();
    cb(null, filename + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/rating/:userId/:productId', ProductController.ratingProduct);

router.post('/create', upload.array('images'), ProductController.createProduct);
router.put('/update/:productId', upload.array('newImages'), ProductController.updateProduct);
router.delete('/delete/:productId', ProductController.deleteProduct);
router.post('/delete-many', ProductController.deleteMany);

router.get('/get-details/:productId', ProductController.getDetailsProduct);
router.get('/get-relevant-products/:productId', ProductController.getRelevantProducts);
router.get('/get-all', ProductController.getAllProduct);
router.get('/get-all-type', ProductController.getAllType);

module.exports = router;
