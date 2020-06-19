const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((product) => {
      res.render("shop/product-list", {
        products: product,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticate: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticate: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((product) => {
      res.render("shop/index", {
        products: product,
        pageTitle: "Shop",
        path: "/",
        isAuthenticate: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticate: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.session.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.session.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrderCreate = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map(cart => ({ quantity: cart.quantity, product: { ...cart.productId._doc } }));
      const order = new Order({
        products,
        user: {
          name: req.session.user.name,
          userId: req.session.user._id,
        }
      });
      return order.save();
    })
    .then(result => {
      return req.session.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order
    .find({ 'user.userId': req.session.user._id })
    .then((orders) => {
      console.log('orders', orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticate: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
