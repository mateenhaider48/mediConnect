const mongoose=require('mongoose');
const express=require("express");
const router=express.Router();
const {body,validationResult}=require("express-validator");
const new_doctor_model=require('../models/new_doctor_model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
router.get('/ad-doctor',(req,res)=>{
    res.render('add-doctor');
});
router.post('/ad-doctor',async(req,res)=>{
   const {d_id,d_name,d_email,d_password,d_phone,d_age,d_gender,d_fees,d_exp,d_salary,d_address,d_specialization}=req.body;
   const hashpassword=await bcrypt.hash(d_password,10);
   const user=await new_doctor_model.create({
        d_id:d_id,
        d_name:d_name,
        d_email:d_email,
        d_password:hashpassword,
        d_phone:d_phone,
        d_age:d_age,
        d_gender:d_gender,
        d_fees:d_fees,
        d_experience:d_exp,
        d_salary:d_salary,
        d_address:d_address,
        d_specialization:d_specialization
    });
    if(user)
      return res.redirect('/user/ad-doctor');
});
router.get('/updateDoctor',async(req,res)=>{
    res.render('update-doctor',{find:false})
});
router.post('/find-doctor',async(req,res)=>{
   const find=await new_doctor_model.findOne({d_id:req.body.doc_id});
   res.render('update-doctor',{find:true,find});
});
router.post("/update-doctor",async(req,res)=>{
    const {doc_id,doc_name,doc_email,doc_phone,doc_age,doc_fees,doc_exp,doc_salary,doc_address,doc_specialization}=req.body;
    const update=await new_doctor_model.findOneAndUpdate({
       d_id:doc_id
    },{
        d_name:doc_name,
        d_email:doc_email,
        d_phone:doc_phone,
        d_address:doc_address,
        d_age:doc_age,
        d_experience:doc_exp,
        d_fees:doc_fees,
        d_salary:doc_salary,
        d_specialization:doc_specialization
    });
    if(update){
        res.redirect('/user/admin-doctor');
    }
    else{
        res.redirect('/user/update-doctor',{error:'cannot update'});
    }
});
router.get('/doctors',async(req,res)=>{
     const doctors=await new_doctor_model.find();
     res.render('doctorinfo',{doctors});
});
router.delete("/delete-doctor/:id",async(req,res)=>{
   const del=await new_doctor_model.findOneAndDelete({d_id:req.params.id});
   
});
module.exports=router;