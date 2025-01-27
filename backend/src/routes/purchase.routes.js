const express = require('express');
const purchaseController = require('../controllers/purchase.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.use(authMiddleware);
router.get('/', purchaseController.getPurchaseHistory);
router.post('/', purchaseController.createPurchase);
router.put('/:id/status', purchaseController.updatePurchaseStatus);

module.exports = router;