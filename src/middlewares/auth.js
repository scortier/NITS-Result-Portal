const User=require("../models/User");
const jwt=require("jsonwebtoken");

module.exports= async(req,res,next)=>{

    try{
        const token = req.cookies.authorization
        const userInfo = await jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(userInfo._id)
        if(!user){
            throw new Error("User not found") 
        }
        req.userInfo={
            token:token,
            user:user
        }
        next();
    }
    catch(err){
        res.status(401).json({
            error:true,
            message:"Login First"
        });
    }
}