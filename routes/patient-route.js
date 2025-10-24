const mongoose=require('mongoose');
const express=require("express");
const router=express.Router();
const {body,validationResult}=require("express-validator");
const patient_model=require('../models/patient_model.js');
const new_doctor_model=require('../models/new_doctor_model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

router.get('/bookapp',async(req,res)=>{
    const doctors=await new_doctor_model.find();
    res.render('book',{doctors});
});
router.post("/edit-appi",[],async(req,res)=>{
    const {editId,editPatient,editDoctor,editDate,editStatus}=req.body;
    const edit=await patient_model.findOneAndUpdate({_id:editId},{
        patient_name:editPatient,
        doctor:editDoctor,
        date:editDate,
        status:editStatus
    });
    if(!edit)
        return res.status(404).send("Appointment can't found.");
    else
        res.redirect('/user/admin-manage-api');
});
router.post("/delete-patient",async(req,res)=>{
   const del=await patient_model.findOneAndDelete({_id:req.body.id});
   if(del)
    res.redirect('/user/admin-manage-api');
   else
    res.status(404).send("Appointment can't found!");
});
router.post('/bookapp',async(req,res)=>{
     const {pname,email,phoneno,pcnic,disease,doctor,date,time}=req.body;
     const status='Pending';
     await patient_model.create({
        patient_name:pname,
        email:email,
        phone:phoneno,
        cnic:pcnic,
        disease:disease,
        doctor:doctor,
        date:date,
        time:time,
        status:status
    });
});
router.get("/book-by-admin",(req,res)=>{
   res.render("book-by-admin");
});

module.exports=router;