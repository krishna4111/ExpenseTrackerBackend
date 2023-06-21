const express=require('express');
 const Expense=require('../controller/expense');
const router=express.Router();
const Middleware=require('../middleware/auth');

router.post('/add-expense',Middleware.authentication,Expense.addExpense)

router.get('/show-all', Middleware.authentication ,Expense.fetchAll);
router.get('/pagination',Middleware.authentication,Expense.paginateData)

router.delete('/delete-expense/:id',Middleware.authentication, Middleware.authentication ,Expense.deleteExpense)

module.exports=router;