const path = require("path");
const fs=require("fs");
const helmet=require("helmet");
const morgan=require("morgan");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require("./util/database");
const { sequelize } = require('./models/expense');
const homeRoutes = require("./routes/homeRoutes");
const userRoutes=require("./routes/userRoutes");
//const logStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
const User=require("./models/users")
const Expense =require("./models/expense")
const Order=require("./models/orders");
const purchaseRoutes=require("./routes/purchase");
const errorController = require("./controllers/errorcontroller");
const Premium= require("./models/premiumuser");
const forgetPasswordRoutes = require('./routes/forgotpassword');
const Forgotpassword = require('./models/forgotpassword');
const DownloadedFile=require('./models/download');
var cors = require("cors");
app.use(cors());
app.use(helmet());

app.use(bodyParser.json({ extended: false }));
//app.use(morgan('combined',{ stream: logStream }))

app.use(express.static(path.join(__dirname, "public")));
app.use(homeRoutes);
app.use(userRoutes);
app.use("/purchase/",purchaseRoutes);
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
  .sync({force:true})
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    //console.log(err);
  });

  app.listen(4000);
