const User=require('../model/user');

const getLeaderBoard=async(req,res)=>{
    try{
        const leaderboardofusers=await User.findAll({
          attributes:['name' , 'totalexpense'],
          order:[['totalexpense','Desc']]
        });
      
        res.status(200).json(leaderboardofusers);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports={
    getLeaderBoard
}