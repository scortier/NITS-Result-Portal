const Admin =require("../models/admin");

// owner
exports.OwnerLogin = async (req, res, next) => {
   try {
      throw Error('Route Not Implemented')
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

// moderator
exports.ModeratorLogin=async (req,res,next)=>{
   try {
      const { password,username } = req.body
      let mod = await Admin.findByCredentials(username, password)
      const JWTtoken = await mod.generateAuthToken()
      mod = mod.toJSON()
      res.cookie('authorization', JWTtoken, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: false,
      })
      res.status(200).json(mod)
  } catch (error) {
      next(error)
  }
}
exports.ModeratorRegister=async (req,res,next)=>{
   try{
           const {username,password,role} =req.body;
           let mod=await Admin.create({
            username,
            role,
            password
           });
           const JWTtoken=await mod.generateAuthToken();
           mod=await mod.toJSON();
           res.cookie("authorization",JWTtoken,{
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
           });
           res.status(201).json(mod);
   }
   catch(error){
       next(error);
   }
}