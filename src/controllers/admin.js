// require("dotenv").config()
const Admin =require("../models/admin");
const jwt =require("jsonwebtoken");

// owner
exports.OwnerLogin = async (req, res, next) => {
   try {
      const {password,username}=req.body;
      console.log(process.env.JWT_SECRET);
      const token =jwt.sign({username:username.toString(),password:password.toString()},process.env.JWT_SECRET);
      res.cookie("authorization",token,{
         maxAge: 24 * 60 * 60 * 1000,
         httpOnly: false,
        });
        res.status(200).send("admin welcome")

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