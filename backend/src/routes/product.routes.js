const express = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authMiddleware);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;