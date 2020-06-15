const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoclient = (callback) => {
  MongoClient.connect('mongodb+srv://m001-student:m001-mongodb-basics@cluster0-kjwk5.mongodb.net/nodeComplete')
  .then(client => {
    console.log('Connected!')
    _db = client.db();
    callback();
  })
  .catch(err => {
    throw err;
  });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw 'Database not found!';
  }
};

exports.mongoclient = mongoclient;
exports.getDb = getDb;