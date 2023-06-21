const express=require('express');
const router=express.Router();
const premiumfeature=require('../controller/premiumcontroller');
const middleware=require('../middleware/auth');


router.get('/show-leaderboard',middleware.authentication,premiumfeature.getLeaderBoard);

module.exports=router;