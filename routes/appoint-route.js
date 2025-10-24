const mongoose=require('mongoose');
const express=require("express");
const router=express.Router();
const {body,validationResult}=require("express-validator");
const patient_model=require('../models/patient_model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

router.get('/appointments',async(req,res)=>{
    console.log(req.session.user);
    const email = req.session.user.email;
    const appoints=await patient_model.find({email:email});
    res.render('appointments',{appoints});
});


module.exports=router;