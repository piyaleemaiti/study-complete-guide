const path = require('path');
const express = require('express');
const { body } = require('express-validator/check');
const adminController = require('../controller/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);
// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);
// /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
// /admin/add-product => POST
router.post('/add-product', [
  body('title', 'Please enter valid title').isString().isLength({ min: 3 }).trim(),
  body('price', 'Please enter valid price').trim().isFloat(),
  body('imageUrl', 'Please enter valid image url').trim().isURL(),
  body('description', 'Please enter description minimun 8 and maximum 400 character').isLength({ min: 8, max: 400 }).trim(),
], isAuth, adminController.postAddProduct);
router.post('/edit-product', [
  body('title', 'Please enter valid title').isString().isLength({ min: 3 }).trim(),
  body('price', 'Please enter valid price').trim().isFloat(),
  body('imageUrl', 'Please enter valid image url').trim().isURL(),
  body('description', 'Please enter description minimun 8 and maximum 400 character').isLength({ min: 8, max: 400 }).trim(),
], isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
