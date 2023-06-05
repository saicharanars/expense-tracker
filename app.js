const path = require("path");

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
var cors = require("cors");
app.use(cors());

const errorController = require("./controllers/errorcontroller");









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
