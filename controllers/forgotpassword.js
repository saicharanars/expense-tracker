require("dotenv").config();
const uuid = require("uuid");
const User = require("../models/users");
const Forgotpassword = require("../models/forgotpassword");
const path = require("path");
const rootDir = path.dirname(__dirname);
var bcrypt = require("bcryptjs");

var SibApiV3Sdk = require("sib-api-v3-sdk");

exports.forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ where: { email } });
    if (user) {
      const id = uuid.v4();
      const forgetpassword = await user.createForgotpassword({
        id,
        active: true,
      });
      var defaultClient = SibApiV3Sdk.ApiClient.instance;

      var apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.SEND_IN_BLUE;
      var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

      sendSmtpEmail = {
        to: [
          {
            email: email,
            name: "user",
          },
        ],
        htmlContent:
          "<html><body><h1>your password reset link</h1></body></html>",
        textContent: `http://localhost:3000/password/resetpassword/${id}`,
        templateId: 59,
        params: {
          name: "John",
          surname: "Doe",
        },
        headers: {
          "X-Mailin-custom":
            "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
        },
      };
      console.log("done");
      const instance = await apiInstance.sendTransacEmail(sendSmtpEmail);
      if (instance) {
        console.log("Link to reset password sent to your mail ");
        console.log(instance);
        return res.status(201).json({
          message: "Link to reset password sent to your mail ",
          messageid: instance.messageId,
          passwordrequestid: id,
          success: true,
        });
      } else {
        console.log("reset passwaord not sent");
      }

      //send mail
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, sucess: false });
  }
};
exports.forgotpasswordhtml = async (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "forgotpassword.html"));
};
exports.resetpassword = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      console.log("pass");
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button type="submit">reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};
exports.updatepassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    console.log(resetpasswordid + "  ", newpassword);

    const resetpasswordrequest = await Forgotpassword.findOne({
      where: { id: req.params.resetpasswordid },
    });
    if (resetpasswordrequest) {
      console.log("forgot", resetpasswordrequest);
      const user = await User.findOne({
        where: { id: resetpasswordrequest.expenseuserId },
      });
      if (user) {
        console.log("userDetails", user);
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        const update = await User.update({password:hashedPassword},{
            where:{
                id:user.id
            }
        });
        res.status(201).json({ message: "Successfuly updated the new password" });
        
      } else {
        return res.status(404).json({ error: "No user Exists", success: false });
      }
    }
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};
