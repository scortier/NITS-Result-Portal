const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')

module.exports.OwnerLogin = async (req, res, next) => {

   const {username, password} = req.body;
   const ownerUsername = process.env.OWNER_USERNAME 
   const ownerPassword = process.env.OWNER_PASSWORD
   console.log(req.body.username)
   console.log(ownerUsername)
   try {
      if(username === ownerUsername && password === ownerPassword) {
         const token = jwt.sign({
            username: ownerUsername,
            password: ownerPassword
         },
         process.env.JWT_SECRET,
         {
            expiresIn: process.env.JWT_EXPIRE,
         })
         res.cookie('authorization', token, { httpOnly: true, maxAge :  24 * 60 * 60 * 1000});
         // dashboard
         res.redirect("/admin/dashboard")

      } else {
         const err = new Error('Invalid Owner Credetials')
         err.statusCode = 403
         throw err
      }
   } catch (error) {
      next(error)
   }
}

exports.AdminLogin = async (req, res, next) => {
   try {
         const {username, password} = req.body
         
         let admin = await Admin.findByCredentials(username, password)
         
         const JWTtoken = await admin.generateAuthToken()
         admin = admin.toJSON()
         res.cookie('authorization', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
      //   res.status(200).json(admin)
      res.redirect("/admin/dashboard")
   } catch (error) {
      next(error)
   }
}

exports.CreateAdmin=async (req,res,next)=>{
   try{
      const  {username,password,role}=req.body;
      let admin = await Admin.create({
          username,
          password,
          role
      });
      
      const JWTtoken =await admin.generateAuthToken();
      admin =admin.toJSON();
      
      res.cookie("authorization",JWTtoken,{
       maxAge: 24 * 60 * 60 * 1000,
       httpOnly: false,  
      });
      
   }
   catch(e){
       next(e);
   }
}
//  gets 
exports.adminLogin_get= async(req,res,next)=>{
   try{
      res.render("adminLogin")
   }
   catch(error){
      console.log(error)
      next()
   }
}

exports.ownerLogin_get=async(req,res,next)=>{
   try{
      res.render('ownerLogin')
   }
   catch(error){

      console.log(error)
      next()

   }
}

exports.dashBoardLogin_get=async(req,res,next)=>{
   try{
      res.render('adminDashboard')
   }
   catch(error){

      console.log(error)
      next()

   }  
}

exports.logout_get=async(req,res,next)=>{
   try{   
      res.clearCookie("authorization").redirect("/admin/login")  
      
   }
   catch(error){
      console.log(error)
      next()

   }  
}