const mongoose=require('mongoose');
const new_doctor_Schema=new mongoose.Schema({
      d_id:{
         type:Number,
         required:true,
         trim:true,
         unique:[true,'Id must be Unique'],
         minlength:3   
      },
      d_name:{
       type:String,
       required:true,
       trim:true,
       unique:true,
       uppercase:true,
       minlength:[3,'Username must be at least 3 character long']
      },
      d_email:{
       type:String,
       required:true,
       trim:true,
       unique:true,
       lowercase:true,
       minlength:[13,'Email must be at least 13 character long']
      },
      d_password:{
       type:String,
       required:true,
       trim:true,
       minlength:[8,'Password must be at least 8 character long']
      },
      d_phone:{
       type:Number,
       required:true,
       trim:true,
       minlength:[11,'Phone Number must be at least 11 character long']
      },
      d_age:{
       type:Number,
       required:true,
       trim:true,
       minlength:3
      },
      d_gender:String,
      d_fees:{
       type:Number,
       required:true,
       trim:true,
       minlength:6
      },
      d_experience:{
       type:Number,
       required:true,
       trim:true,
       minlength:2
      },
      d_salary:{
       type:Number,
       required:true,
       trim:true,
       minlength:6
      },
      d_address:{
       type:String,
       required:true,
       trim:true,
       unique:true,
       lowercase:true,
       minlength:30
      },
      d_time:{
       type:Array
      },
      d_specialization:{
       type:String,
       required:true,
       trim:true,
       lowercase:true,
       minlength:5
      }
});
const new_doctor_model=mongoose.model('new_doctor_model',new_doctor_Schema);
module.exports=new_doctor_model;