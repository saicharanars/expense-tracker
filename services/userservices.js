const ExpenseUsers = require("../models/expense");
const { options } = require("../routes/homeRoutes");
const Expense = require("../models/expense");

// const getExpenses = async(req,{ offset, limit })=>{
//     console.log(req.userid);
//     console.log(offset,limit,"null")
//     console.log(req,{ offset, limit })
//     expenses = await ExpenseUsers.findAll({
//         where: {
//           expenseuserid:req
//         },
//         offset: offset,
//         limit: limit
//       });
//     return expenses;
//     //return req.user.getExpenses(where);
// }
const getExpenses = async (req, { offset = null, limit = null } = {}) => {
    //console.log(req.user.id);
    console.log(offset, limit, "null");
    console.log(req, { offset, limit });
  
    
  
    const expenses = await Expense.find({userId:req}).skip(offset).limit(limit);
  
    return expenses;
  };
  
  

const countExpenses =async(user,where)=>{
console.log(user)
 const count = await Expense.countDocuments({userId:user._id});
 //const countuser= await user.countExpense(where);
 console.log(count)
 return count;
}



module.exports={
 getExpenses,
 countExpenses
}