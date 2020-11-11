const storeBtn = document.getElementById('store-btn');
const retrieveBtn = document.getElementById('retrieve-btn');

let db;

const dbStore = indexedDB.open('StorageDummy', 1);

dbStore.onsuccess = function(event) {
  db = event.target.result;
}

dbStore.onupgradeneeded = function(event) {
  db = event.target.result;
  const objStore = db.createObjectStore('products', { keyPath: 'id'});
  objStore.transaction.oncomplete = function(event) {
    const productStore = db.transaction('products', 'readwrite').objectStore('products');
    productStore.add({
      id: 1,
      name: 'A first Product',
      price: 12.99,
      tags: ['Expensive', 'Luxury'],
    });
  };
};

dbStore.onerror = function(event) {
  console.log('Error');
}

storeBtn.addEventListener('click', () => {
  if (!db) {
    return;
  }
  const productStore = db.transaction('products', 'readwrite').objectStore('products');
  productStore.add({
    id: 2,
    name: 'Second Products',
    price: 23.99,
    tags: ['More Expensive'],
  });
});

retrieveBtn.addEventListener('click', () => {
  const productStore = db.transaction('products', 'readwrite').objectStore('products');
  const result = productStore.get(2);
  result.onsuccess = function() {
    console.log(result.result);
  }
});
