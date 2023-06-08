const uuid = require('uuid');
const  User  =require('../models/users');
const Forgotpassword = require('../models/forgotpassword');

var SibApiV3Sdk = require("sib-api-v3-sdk");
var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

exports.forgotpassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user) {
        const id = uuid.v4();
        user.createForgotpassword({ id, active: true }).catch((err) => {
          throw new Error(err);
        });
        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
       
        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
  
        sendSmtpEmail = {
          to: [
            {
              email: email,
              name: "user",
            },
          ],
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
        apiInstance.sendTransacEmail(sendSmtpEmail).then(
          (response)=> {
            console.log("Link to reset password sent to your mail " + data);
            return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})
          })
          .catch( (err)=>{
            console.log(err)
          }
        );
  
        
  
        //send mail
      } else {
        throw new Error("User doesnt exist");
      }
    } catch (err) {
      console.error(err);
      return res.json({ message: err, sucess: false });
    }
  };