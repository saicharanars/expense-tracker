const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_database','root','724242726',{
  dialect:'mysql',
  host:'localhost'
});

module.exports=sequelize;