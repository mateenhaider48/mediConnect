const mongoose=require('mongoose');
const express=require("express");
const router=express.Router();
const {body,validationResult}=require("express-validator");
const register_model=require('../models/register_model');
const messege_model=require('../models/messege_model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
router.get('/register',(req,res)=>{
    res.render("register");
});    
router.post('/registerForm',
    [
    body('email').trim().isEmail(),
    body('username').trim().isLength({min:3})
    ],
    async(req,res)=>{
    const {fullname,email,password,cnic,phone}=req.body;
     const existing = await register_model.findOne({ email});
     const existingCnic = await register_model.findOne({ cnic});
    if (existing)
    return res.redirect('/user/register?error=email');
    else if(existingCnic)
    return res.redirect('/user/register?error=cnic');
    const hashpassword=await bcrypt.hash(password,10);
    await register_model.create({
        fullname:fullname,
        email:email,
        password:hashpassword,
        cnic:cnic,
        phone:phone
    });
   return res.redirect('/user/register?success=1');
});
router.get('/login',(req,res)=>{
    res.render('login');
})
router.post('/login',async(req,res)=>{
   try{ 
    const {email,password}=req.body;
    const user= await register_model.findOne({
        email:email
    });
    const isMatch=await bcrypt.compare(password,user.password);
    if(user&&isMatch){
       const token=jwt.sign({
        id:user._id,
        email:user.email
    },process.env.JWT_S)
    res.cookie('token',token);
    req.session.user={
        id:user._id,
        email:user.email
    };
    req.session.save((err)=>{
         if (err) {
        return res.send('Session error');
        }
        return res.redirect('/user/home');   
    });
    }
    else{
        return res.render('login',{ error: 'Invalid email or password'});
    }
   
}
catch (err) {
    return res.render('login', { error: 'Something went wrong, please try again.' });
  }

    
});

router.post("/message",[
    body('email').trim().isEmail().isLength({min:13}).withMessage("Email must be at least 13 characters long.")
],async(req,res)=>{
    console.log(req.body);
    const {name,email,message}=req.body;
   
    await messege_model.create({
        name:name,
        email:email,
        messege:message
    });
    res.redirect("/home");
});
router.get('/home',(req,res)=>{
    res.render('home');
})
module.exports=router;