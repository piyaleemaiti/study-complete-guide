const path = require('path');
const express = require('express');

const shopController = require('../controller/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetails);
router.get('/cart', isAuth, shopController.getCart);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:orderId', isAuth, shopController.getOrdersInvoice);
// router.get('/checkout', shopController.getCheckout);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.post('/create-order', isAuth, shopController.postOrderCreate);

module.exports = router;
