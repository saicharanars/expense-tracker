require("dotenv").config();
const Razorpay = require("razorpay");
const Order = require("../models/orders");
const mongoose = require("mongoose");
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
  console.log(req.user,"hsgdyw");
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
    const ordertable = new Order({
      //orderId:new mongoose.Types.ObjectId(),
      status: "PENDING",
      userId: user.userid,
    });
    console.log(ordertable,"table")
    const ordersaved=await ordertable.save()
    console.log(ordersaved, "order from order table");

    res.status(201).json({
      success: true,
      order,
      ordersaved,
      orderStatus: "pending",
      message: "order is created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};
exports.transactionstatus = async (req, res, next) => {
  const { status, order_id,orderId } = req.body;
  console.log(req.body, "body >>>>>>>");
  const userId = req.user._id;
  console.log(order_id, "order_id", status, "status", userId, ">>>>>>",orderId);
  try {
    //const order = await Order.findOne({ orderId: order_id  });

    //console.log(order.orderId, ">>>>>>>");
    const promise1 =
      status === "success"
        ? await Order.updateOne({_id: orderId},{ orderId:order_id,status: "SUCCESSFUL" }) //payment successful
        : await Order.updateOne({_id: orderId},{ orderId:order_id,status: "FAILED" });
    //await order.update({ status: "FAILED" },{where: {id: order.dataValues.id}}) //payment failed
    const promise2 =
      status === "success"
        ? await User.updateOne(
            {_id:userId},
            { isPremiumUser: true },
            
          )
        : await User.updateOne(
            {_id:userId},
            { isPremiumUser: false },
            
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
