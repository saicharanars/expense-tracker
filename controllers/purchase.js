require("dotenv").config();
const Razorpay = require("razorpay");
const Order = require("../models/orders");
const User = require("../models/users");
const PremiumUser = require("../models/premiumuser");
var jwt = require("jsonwebtoken");
exports.premium = async (req, res, next) => {
  console.log(req.headers.authorization);
  const user = await jwt.verify(
    req.headers.authorization,
    "hgtyf1f51ge5ef555sb1f5"
  );
  console.log(user);
  console.log(req.user);
  try {
    var instance = new Razorpay({
      key_id: "rzp_test_0vMGyXdywrzGmu",
      key_secret: "SiqSj5HJZY5R5Iprki6Ha6x6",
    });

    let order = await instance.orders.create({
      amount: 50000,
      currency: "INR",
    });
    console.log(user.userid);
    const ordertable = await Order.create({
      orderId: order.id,
      status: "PENDING",
      expenseuserid: user.userid,
    });
    console.log(ordertable, "order from order table");

    res.status(201).json({
      success: true,
      order,
      orderStatus: "pending",
      message: "order is created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};
exports.transactionstatus = async (req, res, next) => {
  const { status, order_id } = req.body;
  console.log(req.body, "body >>>>>>>");
  const userId = req.user.id;
  console.log(order_id, "order_id", status, "status", userId, ">>>>>>");
  try {
    const order = await Order.findOne({ where: { orderId: order_id } });

    console.log(order.orderId, ">>>>>>>");
    const promise1 =
      status === "success"
        ? order.update({ status: "SUCCESSFUL" }) //payment successful
        : order.update({ status: "FAILED" });
    //await order.update({ status: "FAILED" },{where: {id: order.dataValues.id}}) //payment failed
    const promise2 =
      status === "success"
        ? await User.update(
            { isPremiumUser: true },
            {
              where: {
                id: userId,
              },
            }
          )
        : await User.update(
            { isPremiumUser: false },
            {
              where: {
                id: userId,
              },
            }
          );
    Promise.all([promise1, promise2])
      .then(() => {
        if (status === "success") {
          return res.status(200).json({
            success: true,
            msg: "Transaction Successful",
            token: jwt.sign(
              { useremail: req.user.email, userid: userId, premium: true },
              "hgtyf1f51ge5ef555sb1f5"
            ),
          });
        } else {
          return res
            .status(200)
            .json({ success: false, msg: "Transaction Failed" });
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, msg: "something went wrong" });
  }
};
