const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }]
  }
});

userSchema.methods.addToCart = function (product) {
  const cartItems = this.cart ? this.cart.items : [];
  const cartProductIndex = cartItems.findIndex(
    (cart) => cart.productId.toString() === product._id.toString()
  );
  let updatedCartItems = [...cartItems];
  let newQuantity = 1;
  if (cartProductIndex >= 0) {
    newQuantity = cartItems[cartProductIndex].quantity + newQuantity;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const cartItems = this.cart ? this.cart.items : [];
  const newCartItems = cartItems.filter(cart => cart.productId.toString() !== productId.toString()
  );
  const updatedCart = {
    items: newCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function() {
  const updatedCart = [];
  this.cart.items = updatedCart;
  return this.save();
}

module.exports = mongoose.model('User', userSchema);