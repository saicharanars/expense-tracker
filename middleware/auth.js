const jwt = require("jsonwebtoken");

const User = require("../models/users");

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  var user = jwt.verify(token, "hgtyf1f51ge5ef555sb1f5");
  //console.log(user);
  const project = await User.findOne({ where: { id: user.userid } });
  if (project === null) {
    console.log("Not found!");
  } else {
    //console.log(project instanceof roject); // true
    //console.log(project); // 'My Title'
    req.user = user;
    //console.log(req.user);
    next();
  }
  // User.findByPk(user.userId)
  // .then((user) => {
  //     req.user = user;
  //     console.log(req.user)
  //     next();
  // })
  // .catch((err) => res.status(500).json({msg: 'Could not fetch user'}));
};
