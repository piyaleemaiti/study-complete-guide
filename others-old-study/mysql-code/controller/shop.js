const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/product-list", {
        products: product,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/index", {
        products: product,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart.getProducts()
    .then(products => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchCArt;
  let newQuantity = 1;
  req.user.getCart()
  .then(cart => {
    fetchCArt = cart;
    return cart.getProducts({ where: { id: productId } });
  })
  .then(products => {
    let product;
    if (products.length > 0) {
      product = products[0];
    }
    if (product) {
      newQuantity = newQuantity + product.cartItem.quantity;
      return product;
    }
    return Product.findByPk(productId);
  })
  .then(product => {
    return fetchCArt.addProduct(product, { through: { quantity: newQuantity }});
  })
  .then(() => {
    res.redirect("/cart");
  })
  .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({ where: { id: productId } });
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(result => {
    res.redirect("/cart");
  })
  .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products']})
  .then(orders => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  })
  .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postOrderCreate = (req, res, next) => {
  let fetchCart;
  req.user.getCart()
  .then(cart => {
    fetchCart = cart;
    return cart.getProducts();
  })
  .then(products => {
    return req.user.createOrder()
    .then(order => {
      return order.addProducts(products.map(product => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      }));
    })
    .catch(err => console.log(err));
  })
  .then(orders => {
    return fetchCart.setProducts(null);
  })
  .then(result => {
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
};
