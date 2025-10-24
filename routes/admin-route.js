const mongoose=require('mongoose');
const express=require("express");
const router=express.Router();
const {body,validationResult}=require("express-validator");
const new_admin_model=require('../models/new_admin_model');
const patient_model=require('../models/patient_model.js');
const new_doctor_model=require('../models/new_doctor_model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

router.get('/admin',async(req,res)=>{
   const patient=await patient_model.find(); 
   res.render('admin-dashboard',{patient});
})

router.get('/admin-login',(req,res)=>{
    res.render('admin-login');
});
router.post('/admin-login',async(req,res)=>{
     const {email,password}=req.body;
    const admin=await new_admin_model.findOne({
        ad_email:email
    })
    const isMatch=await bcrypt.compare(password,admin.ad_password);
    if(admin&&isMatch){
               const token=jwt.sign({
                id:admin._id,
                email:admin.ad_email
            },process.env.JWT_S)
            res.cookie('token',token);
            req.session.admin={
                id:admin._id,
                email:admin.ad_email
            };
      return res.redirect('/user/admin');   
    }
    else{
        return res.redirect('/user/admin-login');
    }
});
router.post('/passwordchanges',[],async(req,res)=>{
   const {current,new_p,confirm}=req.body;
   

});
router.get('/new-admin',(req,res)=>{
    res.render('admin-setting');
});
router.post('/new-admin',
    [
        body("ad_email").trim().isEmail().isLength({min:13}).withMessage('Email is not correct!'),
        body('ad_pass').trim().isLength({min:8}).withMessage("Password must be at least 8 character long.")
    ],
    async(req,res)=>{
    const {ad_name,ad_email,ad_phone,ad_pass}=req.body;
    const hashpassword=await bcrypt.hash(ad_pass,10);
    const user=await new_admin_model.create({
        ad_name:ad_name,
        ad_email:ad_email,
        ad_phone:ad_phone,
        ad_password:hashpassword
    });
    if(user)
      return res.redirect('/user/admin-setting');
});
router.post('/profilechanges',[
    body('new_name').trim().isLength({min:5}).withMessage('Name must be at least 5 character long'),
    body("new_email").trim().isEmail().isLength({min:13}).withMessage('Email must be at least 13 characters long.')
],async(req,res)=>{
   const {new_name,new_email,new_phone}=req.body;
   const user=await new_admin_model.findOneAndUpdate({
       ad_email:req.session.admin.email
   },{
       ad_name:new_name,
       ad_email:new_email,
       ad_phone:new_phone
   });
   if(user){
    res.redirect('/user/admin-setting');
   }
   else
    res.redirect('/user/admin-setting');
});
router.get("/admin-doctor",async(req,res)=>{
   const doctors=await new_doctor_model.find();
   res.render('admin-manage-doctors',{doctors});
});
router.get('/admin-manage-api',async(req,res)=>{
    const appointments=await patient_model.find();
    res.render('admin-manage-appoint',{appointments});
});
router.get('/admin-messages',(req,res)=>{
    res.render('admin-massege');
});
router.get('/admin-setting',(req,res)=>{
    res.render('admin-setting');
});
module.exports=router;