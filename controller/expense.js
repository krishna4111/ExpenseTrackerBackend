const Expense = require("../model/expense");
const User=require('../model/user');
const sequelize=require('../util/database')


function isStringValid(string) {
  if (string == undefined || string.length == 0) {
    return true;
  } else {
    return false;
  }
}

exports.addExpense = async (req, res) => {
  const t=await sequelize.transaction();
  try {
    
    const { amount, description, category } = req.body;
   // console.log(amount, description, category);

    if (isStringValid(description) || isStringValid(category)) {
      return res.status(400).json({ success: false, message: "bad parameter" });
    }
    const expense = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.id,
    } , {transaction:t});
    const oldamount=req.user.totalexpense;
    const newamount=Number(oldamount)  + Number(amount) ;
   await User.update({totalexpense:newamount} , {where:{id:req.user.id} , transaction:t });
    await t.commit();
    res.status(201).json({ success: true, message: "expense added successfully", expense });
  } catch (err) {
    await t.rollback()
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.fetchAll = async (req, res) => {
  try {
    const ans = await Expense.findAll({ where: { userId: req.user.id } })
        return res.status(201).json({ success: true, ans });
  }
   catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};

exports.deleteExpense = async (req, res) => {
  const t=await sequelize.transaction();
  try {
    
    const expenseId = req.params.id;

    const expense=await Expense.findByPk(expenseId);
    const reduce=Number(req.user.totalexpense) - Number(expense.amount);
  

    const remove=await Expense.destroy({ where: { id: expenseId, userId: req.user.id } }, {transaction:t});

    await User.update( {totalexpense:reduce} ,  { where : { id:req.user.id } } ,{transaction:t})
   
    
      //in here the result either gives true or false(0 or 1)
      
        if (remove == 0) {
          await t.rollback();
          return res.status(404).json({ success: false , message: "expense dosent belong to the user"  })
        }
        await t.commit();
        return res.status(200).json({ message: "expense deleted succcessfully" });
     
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};

async function countExpenses(req){
  try{
    let totalExpenses=0;
    console.log(req.user.id)
   const allexpenses=await Expense.findAll({where:{userId:req.user.id}});
    allexpenses.forEach(element=>{
      totalExpenses++;
    })
    console.log('totalexp>>' ,totalExpenses );
    return totalExpenses;
  }
  catch(err){
   return err;
  }
}

exports.paginateData = async(req,res)=>{
  try{
    //+req.query.page: The unary plus operator (+) is used to convert the value of req.query.
    //page to a number. It coerces the string value to a numeric value.
    //|| 1: This is a logical OR operator (||) used for defaulting the value. It means if req.query.page is 
    //a falsy value (such as null, undefined, 0, or an empty string), then page will be assigned the value 1 as the default.
    page= +req.query.page || 1;
    const pageSize=+req.query.pageSize || 5;
    console.log('pagesize>>>',req.query);
    console.log('pagesize',pageSize);
    totalExpenses=await countExpenses(req);
    const getData=await Expense.findAll({
      where:{userId:req.user.id},
      // The offset determines the starting point or position from where the data should be retrieved.
      offset:(page-1)*pageSize,
      //limit:pageSize: This line sets the limit parameter, indicating the maximum number of items to be 
      //retrieved per page. It defines the size or length of each page of data.
      limit:pageSize,
      order:[['id' , 'DESC']]
    });
    res.status(200).json({
      allExpenses: getData,
      currentPage: page,
      hasNextPage: (page*pageSize) <totalExpenses,
      nextPage:page+1,
      hasPreviousPage:page>1,
      previousPage:page-1,
      lastPage:Math.ceil(totalExpenses/pageSize)
    })

  }
  catch(err){
    console.log(err);
    res.status(400).json({success:'false' , Error:err});
  }
}
