const User =require("../models/User");


exports.login = async(req, res, next) => {
    try {
       const {password,sch_id}=req.body;
       let user=await User.findByCredentials(sch_id,password);
       const JWTtoken=await user.generateAuthToken();
       user=user.toJSON();
       res.status(200).json({
           JWTtoken,
           user
       });
        
    } catch (error) {
        next(error)
    }   
}

exports.register = async (req, res, next) => {
    try {
       const {name,password,sch_id}=req.body;
       let user=await User.create({
           name,
           password,
           sch_id
       });
       const JWTtoken= await user.generateAuthToken();
       user=await user.toJSON();
       res.status(201).json({
           user,
           JWTtoken
       })
    } catch (error) {
        next(error)
    }
}

