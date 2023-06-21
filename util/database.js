const Sequelize=require('sequelize');
const dotenv = require("dotenv");
//dotenv.config();
require('dotenv').config();


const sequelize=new Sequelize(process.env.DB_NAME, process.env.DB_USER_NAME,process.env.DB_USER_PASSWORD,{
   // const sequelize=new Sequelize('expense', 'root','root',{   
    dialect:'mysql',
    host:process.env.DB_HOST,
})

module.exports=sequelize;