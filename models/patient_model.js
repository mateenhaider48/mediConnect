const mongoose=require('mongoose');
const patient_Schema=new mongoose.Schema({
      patient_name: {
       type:String,
       required:true,
       trim:true,
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
      phone:Number,
      cnic:Number,
      disease:String,
      doctor:String,
      date:Date,
      time:String,
      status:String
});

const patient_model=mongoose.model('patient_model',patient_Schema);
module.exports=patient_model;