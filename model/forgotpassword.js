const Sequelize=require('sequelize');
const sequelize=require('../util/database');


const forgotpassword=sequelize.define('forgotpasswordrequests',{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true        
    },
    active:{
        type:Sequelize.BOOLEAN
    }
})

module.exports=forgotpassword;