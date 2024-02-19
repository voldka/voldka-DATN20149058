const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = require('express').Router();
const ProductTypeController = require('../controllers/ProductTypeController');
const generateFilename = require('../utils/generateFilename');

const uploadFile = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const folderPath = path.resolve(
        __dirname,
        '../',
        '../',
        'public',
        'uploads',
        'product_types',
      );
      fs.mkdirSync(folderPath, { recursive: true });
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      const filename = generateFilename();
      cb(null, filename + path.extname(file.originalname));
    },
  }),
});

router.delete('/delete/:productTypeId', ProductTypeController.delete);
router.patch('/update/:productTypeId', uploadFile.single('image'), ProductTypeController.update);
router.post('/create', uploadFile.single('image'), ProductTypeController.create);
router.route('/').get(ProductTypeController.getAll);

module.exports = router;
