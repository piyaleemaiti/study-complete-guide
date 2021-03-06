class Product {
  title = 'DEFAULT';
  imageUrl;
  price;
  description;

  constructor(title, image, price, description) {
    this.title = title;
    this.imageUrl = image;
    this.price = price;
    this.description = description;
  }
}
class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }
  createRootElement(tag, cssName, attributes) {
    const rootElement = document.createElement(tag);
    rootElement.className = cssName;
    if (attributes && attributes.length > 0) {
      attributes.forEach((attribute) => {
        rootElement.setAttribute(attribute.name, attribute.value);
      });
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  items = [];
  set cartItems(value) {
    this.items = value;
    this.totalOut.innerHTML = `<h2>Total : INR ${this.totalAmount.toFixed(2)}</h2>`;
  }
  get totalAmount() {
    const sum = this.items.reduce((prev, curr) => (+prev + +curr.price), 0);
    return sum;
  }
  constructor(renderHookId) {
    super(renderHookId, false);
    this.orderProducts = () => {
      console.log('Order now...');
      console.log(this.items);
    };
    this.render();
  }
  addProduct(product) {
    const updatedItem = [...this.items];
    updatedItem.push(product);
    this.cartItems = updatedItem;
  }
  render() {
    const cartEl = this.createRootElement('section', 'cart');
    cartEl.innerHTML = `
      <h2>Total : INR ${0}</h2>
      <button>Order Now!</button>
    `;
    const orderButton = cartEl.querySelector('button');
    orderButton.addEventListener('click', this.orderProducts);
    this.totalOut = cartEl.querySelector('h2');
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }
  addToCart () {
    App.addProductTocart(this.product);
  }
  render() {
    const prodEl = this.createRootElement('li', 'product-item');
    prodEl.innerHTML = `
      <div>
        <img src="${this.product.imageUrl}" alt="${this.product.title}" />
        <div class="product-item__content">
          <h2>${this.product.title}</h2>
          <h3>INR ${this.product.price}</h3>
          <p>${this.product.description}</p>
          <button>Add to Cart</button>
        </div>
      </div>
    `;
    const addCart = prodEl.querySelector('button');
    addCart.addEventListener('click', this.addToCart.bind(this));
  }
}

class ProductList extends Component {
  #products = [];

  constructor(renderHookId) {
    super(renderHookId, false);
    this.render();
    this.#fetchProduct();
  }

  #fetchProduct() {
    this.#products = [
      new Product(
        'Nikon D6',
        'https://www.nikon.co.in///tmp/Asia/4016499630/3857477713/365508689/3015334490/1054978028/443944295/2580402099/3353927964/2212294583.png',
        '466',
        'Nikon D6 DSLR'
      ), new Product(
        'Nikon 780',
        'https://www.nikon.co.in///tmp/Asia/4016499630/3857477713/365508689/3015334490/1054978028/626028340/2580402099/3353927964/1334408982.png',
        '466',
        'New Nikon 780 DSLR',
      ),
    ];
    this.renderProducts();
  }

  renderProducts() {
    for (const prod of this.#products) {
      new ProductItem(prod, 'prod-list');
    }
  }

  render() {
    this.createRootElement('ul', 'product-list', [new ElementAttribute('id', 'prod-list')]);
    if (this.#products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop {
  constructor() {
    this.render();
  }
  render() {
    this.cart = new ShoppingCart('app');
    new ProductList('app');
  }
}

class App {
  
  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductTocart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
