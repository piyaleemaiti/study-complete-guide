const { ObjectId } = require("mongodb");
const getDb = require("../util/database").getDb;

const collectionName = "products";

class Product {
  constructor(productDetails) {
    this.productDetails = productDetails;
  }

  save() {
    const db = getDb();
    let dbOps;
    const { _id, ...updatedValues } = this.productDetails;
    if (_id) {
      dbOps = db
        .collection(collectionName)
        .updateOne(
          { _id: ObjectId(this.productDetails._id) },
          { $set: updatedValues }
        );
    } else {
      dbOps = db.collection(collectionName).insertOne(updatedValues);
    }
    return dbOps
      .then((result) => console.log(result))
      .catch((err) => {
        throw err;
      });
  }

  static delete(productId) {
    const db = getDb();
    return db
      .collection(collectionName)
      .deleteOne({ _id: ObjectId(productId) })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection(collectionName)
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.log("err", err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection(collectionName)
      .find({ _id: ObjectId(productId) })
      .next()
      .then((product) =>  product)
      .catch((err) => console.log("err", err));
  }
}

module.exports = Product;
