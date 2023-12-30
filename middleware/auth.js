const jwt = require("jsonwebtoken");

const User = require("../models/users");
exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if(!token){
    return res.status(401).json({ error: "Token is missing" });
  }
  const user = await jwt.verify(token, "hgtyf1f51ge5ef555sb1f5");
  console.log(user)
  const project = await User.findById(user.userid).exec();
  console.log(project)
  if (project) {
    
    req.user = project;
    
    console.log(req.user, "user from auth js");
    next();
  } else {
    console.log("Not found!");
    return res.status(401).json({ error: "Authentication failed" });
    return;
  }
};
