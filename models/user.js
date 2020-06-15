const { get } = require("../routes/shop");

const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb");
const Product = require("./product");

const UserCollectionName = "users";
const productCollectionName = "products";
const OrderCollectionName = "orders";
class User {
  constructor(userDetails) {
    this.userDetails = userDetails;
  }

  save() {
    const db = getDb();
    const { _id, ...saveDetails } = this.userDetails;
    let dbOps;
    if (_id) {
      dbOps = db
        .collection(UserCollectionName)
        .updateOne({ _id: ObjectId(userId) }, { $set: saveDetails });
    } else {
      dbOps = db.collection(UserCollectionName).insertOne(saveDetails);
    }
    return dbOps.then((result) => result).catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDb();
    const cartItems = this.userDetails.cart ? this.userDetails.cart.items : [];
    console.log("cartItems", this.userDetails);
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
        productId: ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    return db
      .collection(UserCollectionName)
      .updateOne(
        { _id: ObjectId(this.userDetails._id) },
        { $set: { cart: updatedCart } }
      )
      .catch((err) => console.log(err));
  }

  getCart() {
    const cartItems = this.userDetails.cart ? this.userDetails.cart.items : [];
    const db = getDb();
    const productIds = cartItems.map((product) => product.productId);
    return db
      .collection(productCollectionName)
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => ({
          ...product,
          quantity: cartItems.find(
            (cart) => cart.productId.toString() === product._id.toString()
          ).quantity,
        }));
      })
      .catch((err) => console.log(err));
  }

  deleteCart(productId) {
    const db = getDb();
    const cartItems = this.userDetails.cart ? this.userDetails.cart.items : [];
    const newCartItems = cartItems.filter(
      (cart) => cart.productId.toString() !== productId.toString()
    );
    return db
      .collection(UserCollectionName)
      .updateOne(
        { _id: ObjectId(this.userDetails._id) },
        { $set: { cart: { items: newCartItems } } }
      )
      .catch((err) => console.log(err));
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const orderItems = {
          items: products,
          user: {
            _id: ObjectId(this.userDetails._id),
            name: this.userDetails.name,
          },
        };
        return db
          .collection(OrderCollectionName)
          .insertOne(orderItems)
          .then((result) => {
            return db
              .collection(UserCollectionName)
              .updateOne(
                { _id: ObjectId(this.userDetails._id) },
                { $set: { cart: { items: [] } } }
              )
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    const db = getDb();
    return db
      .collection(OrderCollectionName)
      .find({ 'user._id': ObjectId(this.userDetails._id) })
      .toArray()
      .then((orders) => orders)
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDb();
    return db.collection(UserCollectionName).findOne({ _id: ObjectId(userId) });
  }
}

module.exports = User;
