const Sequelize = require('sequelize');

const sequelize = new Sequelize('pilu_node', 'root', 'admin2728', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;