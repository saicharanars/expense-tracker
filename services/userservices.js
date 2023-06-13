const ExpenseUsers = require("../models/expense");
const { options } = require("../routes/homeRoutes");

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
    console.log(req.userid);
    console.log(offset, limit, "null");
    console.log(req, { offset, limit });
  
    const queryOptions = {
      where: {
        expenseuserid: req
      }
    };
  
    if (offset !== null && limit !== null) {
      queryOptions.offset = offset;
      queryOptions.limit = limit;
    }
  
    const expenses = await ExpenseUsers.findAll(queryOptions);
  
    return expenses;
  };
  
  

const countExpenses =async(user,where)=>{
console.log(user)
 const count = await ExpenseUsers.count({where:{expenseuserid:user.userid}});
 //const countuser= await user.countExpense(where);
 console.log(count)
 return count;
}



module.exports={
 getExpenses,
 countExpenses
}