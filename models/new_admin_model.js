const mongoose=require('mongoose');
const new_admin_Schema=new mongoose.Schema({
      ad_name:{
       type:String,
       required:true,
       trim:true,
       unique:true,
       lowercase:true,
       minlength:[3,'Username must be at least 3 character long']
      },
      ad_email:{
       type:String,
       required:true,
       trim:true,
       unique:true,
       lowercase:true,
       minlength:[13,'Email must be at least 13 character long']
      },
      ad_phone:{
       type:Number,
       required:true,
       trim:true,
       minlength:[11,'Phone Number must be at least 11 character long']
      },
      ad_password:{
       type:String,
       required:true,
       trim:true,
       minlength:[8,'Password must be at least 8 character long']
      }
});
const new_admin_model=mongoose.model('new_admin_model',new_admin_Schema);
module.exports=new_admin_model;