const mongoose=require('mongoose');
const register_Schema=new mongoose.Schema({
      fullname:{
       type:String,
       required:true,
       trim:true,
       unique:true,
       lowercase:true,
       minlength:[3,'Username must be at least 3 character long']
      },
      email:{
       type:String,
       required:true,
       trim:true,
       unique:true,
       lowercase:true,
       minlength:[13,'Email must be at least 13 character long']
      },
      password:{
       type:String,
       required:true,
       trim:true,
       minlength:[8,'Password must be at least 9 character long']
      },
      cnic:{
       type:Number,
       required:true,
       trim:true,
       minlength:[13,'CNIC must be at least 13 character long']
      },
      phone:{
       type:Number,
       required:true,
       trim:true,
       minlength:[11,'Phone Number must be at least 11 character long']
      }
});
const register_model=mongoose.model('register_model',register_Schema);
module.exports=register_model;
