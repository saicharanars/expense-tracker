const path = require("path");
const rootDir = path.dirname(__dirname);
const ExpenseUsers = require("../models/users");
var bcrypt = require("bcryptjs");

exports.postSignup = async (req, res, next) => {
  try {
    //const { name, email, phone } = req.body;
    const Username = req.body.username;
    const Email = req.body.email;
    const Password = req.body.password;
    console.log(Username, Email, Password);
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(Password, 10);
    const [user, created] = await ExpenseUsers.findOrCreate({
      where: { email: Email },
      defaults: {
        username: Username,
        password: hashedPassword,
      },
    });
    if (!created) {
      res
        .status(200)
        .json({ users: "email already used", emailexist: created }); // This will certainly be 'Technical Lead JavaScript'
    } else {
      res.status(200).json({ users: user, emailexist: created });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

exports.getSignup = async (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "signup.html"));
};
exports.getLogin = async (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "loginpage.html"));
};
exports.postLogin = async (req, res, next) => {
  try {
    const Email = req.body.email;
    const Password = req.body.password;
    //console.log(Email, Password);
    //console.log(req.body);
    const emailfind = await ExpenseUsers.findOne({
      where: {
        email: Email,
      },
    });

    if (!emailfind) {
      res.status(404).json({ users: "email not exits please signup" });
    } else {
      const resp = await bcrypt.compare(Password, emailfind.password);
      if (resp) {
        res.status(200).json({ login: resp });
      } else {
        res.status(401).json({ login: "check your password" });
      }
      // if (emailfind.password === Password) {
      //   res.status(200).json({ user: emailfind, login: "login sucessfull" });
      // } else {
      //   res.status(401).json({ login: "check your password" });
      // }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};
