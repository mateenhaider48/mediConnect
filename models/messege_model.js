const mongoose=require('mongoose');
const messege_Schema=new mongoose.Schema({
      name:{
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
      messege:{
       type:String,
       required:true,
       trim:true,
       minlength:[10,'Messege must be at least 10 characters long']
      }
});
const messege_model=mongoose.model('messege_model',messege_Schema);
module.exports=messege_model;