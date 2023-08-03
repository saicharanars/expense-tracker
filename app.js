const path = require("path");
// const fs = require("fs");
const mongoose = require("mongoose");
// const helmet = require("helmet");
// const morgan = require("morgan");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const Sequelize = require("./util/database");
// const { sequelize } = require("./models/expense");
 const homeRoutes = require("./routes/homeRoutes");
 const userRoutes = require("./routes/userRoutes");
// const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
//   flags: "a",
// });
// const User = require("./models/users");
//  const Expense = require("./models/expense");
//  const Order = require("./models/orders");
 const purchaseRoutes = require("./routes/purchase");
 const errorController = require("./controllers/errorcontroller");
 //const Premium = require("./models/premiumuser");
 const forgetPasswordRoutes = require("./routes/forgotpassword");
 //const Forgotpassword = require("./models/forgotpassword");
 //const DownloadedFile = require("./models/download");
// var cors = require("cors");
// app.use(cors());
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );
 app.use(bodyParser.json({ extended: false }));
// app.use(morgan("combined", { stream: logStream }));
 app.use(express.static(path.join(__dirname, "public")));
 app.use(homeRoutes);
 app.use(userRoutes);
 app.use("/purchase/", purchaseRoutes);
 app.use("/password", forgetPasswordRoutes);
// app.use((req, res) => {
//   console.log("url", req.url);
//   res.sendFile(path.join(__dirname, `public/${req.url}`));
// });


app.use(errorController.get404);

// sequelize
//   .sync()
//   .then((result) => {
//     // console.log(result);
//     app.listen(3000);
//   })
//   .catch((err) => {
//     //console.log(err);
//   });
mongoose
  .connect(
    "mongodb+srv://saicharanars:724242726@cluster0.sexo9ar.mongodb.net/expensetracker?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("started")
    
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });


