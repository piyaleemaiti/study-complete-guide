const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(productDetails) {
    this.productDetails = productDetails;
  }

  save() {
    getProductsFromFile(products => {
      if (this.productDetails.id) {
        const updateProductId = products.findIndex((product) => product.id === this.productDetails.id);
        const updatedProduct = [...products];
        updatedProduct[updateProductId] = this.productDetails;
        fs.writeFile(p, JSON.stringify(updatedProduct), err => {
          console.log('err', err);
        });
      } else {
        this.productDetails.id = Math.random().toString();
        products.push(this.productDetails);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log('err', err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }

  static delete(id) {
    getProductsFromFile(products => {
      const product = products.find((prod) => prod.id === id);
      const delProductId = products.findIndex((product) => product.id === id);
      const updatedProduct = [...products];
      updatedProduct.splice(delProductId, 1);
      fs.writeFile(p, JSON.stringify(updatedProduct), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
        console.log('err', err);
      });
    });
  }
};
