const fs = require('fs');
const path = require('path');

const Cart = require('./cart');
const db = require('../util/database');

module.exports = class Product {
  constructor(productDetails) {
    this.productDetails = productDetails;
  }

  save() {
    return db.execute('INSERT INTO products(title, price, imageUrl, description) VALUES(?, ?, ?, ?)',
    [this.productDetails.title, this.productDetails.price, this.productDetails.imageUrl, this.productDetails.description]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }

  static delete(id) {
    
  }
};
