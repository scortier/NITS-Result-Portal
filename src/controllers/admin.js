
const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const maxAge =  24 * 60 * 60
const ownerUsername = process.env.OWNER_USERNAME
const ownerPassword = process.env.OWNER_PASSWORD
const payload = {
   username: ownerUsername,
   password: ownerPassword
}
const createToken = (payload) => {
    return jwt.sign({payload},process.env.JWT_SECRET,{
        expiresIn: maxAge,
    })
}
module.exports.OwnerLogin = async (req, res) => {
   const {username, password} = req.body;
   try {
      if(username === ownerUsername && password === ownerPassword) {
      const token = createToken()
      res.cookie('jwt', token, { httpOnly: true, maxAge : maxAge});
      console.log("Logged in successfully")
      res.status(200).redirect("/")
   }
   } catch (error) {
      console.log(error)
      res.redirect("/admin/owner/login")
   }
}

exports.AdminLogin = async (req, res, next) => {
   try {
         const {username, password} = req.body
         let admin = await User.findByCredentials(username, password)
         const JWTtoken = await user.generateAuthToken()
         admin = admin.toJSON()
         res.cookie('authorization', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
        res.status(200).json(admin)
   } catch (error) {
      next(error)
   }
}


exports.register = async (req, res, next) => {
   try {
      throw Error('Route Not Implemented')
   } catch (error) {
      next(error)
   }
}


exports.CreateModerator=async (req,res,next)=>{
   try{

      const  {username,password,role}=req.body;
      let admin=await Admin.create({
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
      res.status(201).json(admin);
}
   catch(e){
       next(e);
   }
}
// moderator
exports.ModeratorLogin=async (req,res,next)=>{
   try {
       console.log("yooyoy");
       const { password,username } = req.body
       let moderator = await Admin.findByCredentials(username,password)
       console.log(moderator);
       const JWTtoken = await moderator.generateAuthToken()
       moderator = moderator.toJSON();
       res.cookie('authorization', JWTtoken, {
           maxAge: 24 * 60 * 60 * 1000,
           httpOnly: false,
       });
       res.status(200).json(moderator)
   } catch (error) {
       next(error)
   }
}