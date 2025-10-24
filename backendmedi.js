const express=require('express');
const app=express();
const path=require('path');
const { name } = require('ejs');
const session=require('express-session');
const dotenv=require('dotenv');
dotenv.config();
const CookieParser=require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(CookieParser());
app.use(express.static(path.join(__dirname,'public')));
app.set("view engine",'ejs');
const ConnectToDbn=require('./configuration/db_connection');
ConnectToDbn();

app.use(session({
  secret:'logged69',
  resave:false,
  saveUninitialized:false,
  cookie: { maxAge:100 * 60 *30 } 
}));
app.get('/',(req,res)=>{
    res.render('index');
});
app.use('/user',require("./routes/register-route.js"));
app.use('/user',require('./routes/patient-route.js'));
app.use('/user',require('./routes/doctors-route.js'));
app.use('/user',require('./routes/admin-route.js'));
app.use('/user',require('./routes/appoint-route.js'));





app.listen(3000);