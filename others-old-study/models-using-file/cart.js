const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addToCart(id, price) {
    fs.readFile(p, (err, fileContent) => {
      let cart = {products: [], totalPrice: 0};
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductInd = cart.products.findIndex((product) => (product.id === id));
      const existingProduct = cart.products[existingProductInd];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = {...existingProduct};
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductInd] = updatedProduct;
      } else {
        updatedProduct = {id: id, qty: 1};
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log('err', err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedProduct = {... JSON.parse(fileContent)};
      const product = updatedProduct.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      updatedProduct.products = updatedProduct.products.filter((product) => product.id !== id);
      updatedProduct.totalPrice = updatedProduct.totalPrice - productPrice * product.qty;
      fs.writeFile(p, JSON.stringify(updatedProduct), err => {
        console.log('err', err);
      });
    });
  }

  static getAllCart (cd) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const carDetails = {... JSON.parse(fileContent)};
      cd(carDetails);
    });
  }

  static deleteCart(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = {... JSON.parse(fileContent)};
      const product = updatedCart.products.find((prod) => prod.id === id);
      updatedCart.products = updatedCart.products.filter(product => product.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * product.qty;
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log('err', err);
      });
    });
  }
}