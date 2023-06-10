
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const DownloadedFile = sequelize.define("downloadedfile", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  
    downloadDate:{
      type:Sequelize.DATE,
      allowNull:false,
    } ,
  
    fileName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  
    
  });

module.exports = DownloadedFile;