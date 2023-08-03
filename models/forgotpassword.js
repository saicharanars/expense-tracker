const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const forgotSchema = new Schema({
  
  active: {
    type: Boolean,
    required: true,
  },
  expiresby: {
    type: Date,
    default: Date.now,
    
  },
  userId : {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
}
});

module.exports = mongoose.model("forgot", forgotSchema);

// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Forgotpassword = sequelize.define('forgotpassword',{
//     id:{
//         type:Sequelize.UUID,
//         allowNull:false,
//         primaryKey:true
//     },
//     active:Sequelize.BOOLEAN,
//     expiresby:Sequelize.DATE
// })

// module.exports = Forgotpassword;