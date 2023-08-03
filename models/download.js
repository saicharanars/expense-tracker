const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const downloadSchema = new Schema({
  downloadDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

module.exports = mongoose.model("download", downloadSchema);
// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const DownloadedFile = sequelize.define("downloadedfile", {
//     id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true,
//     },

//     downloadDate:{
//       type:Sequelize.DATE,
//       allowNull:false,
//     } ,

//     fileName: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },

//   });

// module.exports = DownloadedFile;
