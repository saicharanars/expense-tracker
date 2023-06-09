require("dotenv").config();
const Razorpay = require("razorpay");
const Order = require("../models/orders");
const User = require("../models/users");
const PremiumUser = require("../models/premiumuser");
var jwt = require("jsonwebtoken");
exports.premium = async (req, res, next) => {
  // const rzp = new Razorpay({
  //     key_id: 'rzp_test_0vMGyXdywrzGmu',
  //     key_secret: 'SiqSj5HJZY5R5Iprki6Ha6x6',
  // });
  // const amount = 250;
  // console.log(rzp,amount); //amount is in paise and not rupees
  // let rzpOrder;
  // rzp.orders.create({amount: amount, currency:'INR'})
  // .then((order) => {
  //     rzpOrder = order;
  //     return User.createOrder({orderid: order.id, status: 'PENDING'});
  // })
  // .then((order) => {
  //     res.status(201).json({order: rzpOrder, key_id: rzp.key_id});
  //     return;
  // })
  // .catch((err) => {console.log(err);
  //     res.status(403).json({error: err, msg: 'something went wrong'});
  // });
  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    let order = await instance.orders.create({
      amount: 50000,
      currency: "INR",
    });

    console.log(req.user);
    const ordertable = await Order.create({
      orderId: order.id,
      status: "PENDING",
      expenseuserid: req.user.userid,
    });
    console.log(ordertable);

    res.status(201).json({
      success: true,
      order,
      key_id: instance.key_id,
      orderStatus: "pending",
      message: "order is created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};
exports.transactionstatus = async (req, res, next) => {
  const { payment_id, order_id, status } = req.body;
  console.log(req.body);
  const userId = req.user.userid;
  try {
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 =
      status === "success"
        ? order.update({ status: "SUCCESSFUL" }) //payment successful
        : order.update({ status: "FAILED" }); //payment failed
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
