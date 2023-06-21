const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const AWS=require('aws-sdk');
const UserService = require('../services/userservice');
const S3Service=require('../services/S3service');
const FilesDownload=require('../model/filesdoenloaded')
const sequelize=require('../util/database')



const downloadExpense=async (req,res)=>{
  const t = await sequelize.transaction();
  try{
    const expenses=await UserService.getExpense(req,{where:{userId:req.user.id}});
    console.log(expenses);
  
    const stringifiedExpense=JSON.stringify(expenses);
    const userId=req.user.id;

    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileURl= await S3Service.updatedToS3(stringifiedExpense , filename);
    await FilesDownload.create({
      filelink:fileURl,
      userId
    });
    await t.commit();
    res.status(200).json({fileURl , success:true});
  }
  catch(err){
    await t.rollback();
    console.log(err);
    res.status(500).json({message :"something went wrong"});
  }
  

}
const downloadLinks=async (req,res)=>{
  const t = await sequelize.transaction();
try{
  const url=await FilesDownload.findAll({where:{userId:req.user.id}})
  res.status(200).json({sucess:'true',url})
}
catch(err){
  console.log(err);
  res.status(500).json({success:'false',error:err});
}
}


function isStringValid(string) {
  if (string == undefined || string.length == 0) {
    return true;
  } else {
    return false;
  }
}
const signup = async (req, res, next) => {
  try {
    //using destructor here
    const { name, email, password } = req.body;

    if (
      isStringValid(name) ||
      isStringValid(email) ||
      isStringValid(password)
    ) {
      //status 400 means bad parameter
      return res
        .status(400)
        .json({ err: "bad parameter, some parameter is missing" });
    }
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      await User.create({ name, email, password: hash, ispremiumuser: false});
      res.status(201).json({ message: "successfully created new user" });
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};
function generateAccessToken(id , name , ispremiumuser) {
  return jwt.sign({ userId: id,name,ispremiumuser}, "secretkey");
}

const loginCheck = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const check = await User.findAll({ where: { email } });
    if (check.length >= 1) {
      bcrypt.compare(password, check[0].password, (err, result) => {
        
        if (err) {
          //res.status(500).json({success:false , message:'wrong password'})
          //instead sending error we can through error
          throw new Error("something went wrong");
          //the above line directly takes our code to catch block
        }
        if (result === true) {
          res.status(201).json({ success: true, message: "user logged in successfully", token: generateAccessToken(check[0].id , check[0].name , check[0].ispremiumuser) });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "password is wrong" });
        }
      });
    }

    //if user dosent exist
    else {
      return res
        .status(404)
        .json({ success: false, message: "user dosent exitst" });
    }
  } catch (err) {
    res.status(500).json({ message: err, success: false });
  }
};

module.exports={
  signup,
  generateAccessToken,
  loginCheck,
  downloadExpense,
  downloadLinks
}