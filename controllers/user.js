const path = require("path");
const rootDir = path.dirname(__dirname);
const ExpenseUsers = require("../models/users");

exports.postSignup = async (req, res, next) => {
  try {
    //const { name, email, phone } = req.body;
    const Username = req.body.username;
    const Email = req.body.email;
    const Password = req.body.password;
    console.log(Username, Email, Password);
    console.log(req.body);
    const [user, created] = await ExpenseUsers.findOrCreate({
      where: { email: Email },
      defaults: {
        username: Username,
        password: Password,
      },
    });
    if (!created) {
        res.status(200).json({ users: "email already used"}); // This will certainly be 'Technical Lead JavaScript'
    }else{
        res.status(200).json({ users: "success" });
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
