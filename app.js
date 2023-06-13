const path = require("path");
const fs=require("fs");
const helmet=require("helmet");
const morgan=require("morgan");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: false }));
const Sequelize = require("./util/database");
const { sequelize } = require('./models/expense');
//app.use(express.json());
const homeRoutes = require("./routes/homeRoutes");
//app.use(homeRoutes);
app.use(homeRoutes);
const userRoutes=require("./routes/userRoutes");
app.use(userRoutes);
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
const logStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
//app.use(morgan('combined',{ stream: logStream }))
var cors = require("cors");
app.use(cors());
const User=require("./models/users")
const Expense =require("./models/expense")
const Order=require("./models/orders");
const purchaseRoutes=require("./routes/purchase");
app.use("/purchase/",purchaseRoutes);
const errorController = require("./controllers/errorcontroller");
const Premium= require("./models/premiumuser");
const forgetPasswordRoutes = require('./routes/forgotpassword');
const Forgotpassword = require('./models/forgotpassword');
const DownloadedFile=require('./models/download')
app.use('/password',forgetPasswordRoutes);
User.hasMany(Expense, { as: 'expenses' });
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
Premium.belongsTo(User);
User.hasMany(Forgotpassword);

Forgotpassword.belongsTo(User);
User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);







app.use(errorController.get404);

sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    //console.log(err);
  });

  app.listen(4000);
