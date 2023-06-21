const express=require('express');
const User=require('../controller/usercontroller');
const middleWare=require('../middleware/auth');
const router=express.Router();



router.post('/signup',User.signup);
router.get('/download',middleWare.authentication,User.downloadExpense);
router.post('/login',User.loginCheck)
router.get('/show-downloadLink',middleWare.authentication,User.downloadLinks)


module.exports=router;