const express=require('express');
const router=express.Router();
const forgotpasswordController=require('../controller/forgotpassword')



router.post('/forgotpassword',forgotpasswordController.forgotPassword);
router.get('/resetpassword/:id',forgotpasswordController.resetpassword);
router.get('/updatepassword/:forgotpasswordId',forgotpasswordController.updatepassword)


module.exports=router;