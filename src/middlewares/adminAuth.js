const Admin = require('../models/admin')
const jwt = require('jsonwebtoken');

const  Role = {
    Owner:"owner",
    Moderator:"moderator",
    Viewer: "viewer"
}

const adminAuth =  (allowedRoles) => {
    return async (req, res, next) => {
        try {
            
            if(allowedRoles instanceof String) {

                allowedRoles = [allowedRoles];
            }
                
            // Get the data from the authorization cookies
            const token = req.cookies.authorization
            if(token==undefined){
                return res.redirect("/admin/login")
            }
            const userInfo = await jwt.verify(token, process.env.JWT_SECRET)
            
            // if the allowedRoles contains owner and current user is owner, call next()
            
            if(allowedRoles.includes(Role.Owner) && 
               userInfo.username === process.env.OWNER_USERNAME && 
               userInfo.password === process.env.OWNER_PASSWORD ) 
            {
                req.adminInfo = {
                    role: Role.Owner
                }
                next();
            } 
            else {
                // For another admin get the document from db and verify for each allowed role 
                if(userInfo._id) {
                    const admin = await Admin.findById(userInfo._id);
                    // console.log(admin);
                    if(!admin) {
                        throw new Error('Admin Not Found')
                    }
                    // for(role in [allowedRoles]){
                        
                    // }
                    allowed = false;
                    for(let i = 0; i < allowedRoles.length; i++) {
                        const role = allowedRoles[i]
                        if(admin.role === role){
                        req.adminInfo = {
                                token: token,
                                admin: admin,
                                role: admin.role
                            }
                            allowed = true;
                            next();
                            break;
                        }
                        
                    }
                    if(!allowed) {
                        const err = new Error('Permission Not Granted')
                        err.statusCode = 403
                        throw err
                    }
                } else {
                    const err = new Error('Permission Not Granted')
                    err.statusCode = 403
                    throw err
                }
            }
        } catch (err) {
            res.status(401).json({
                error: true,
                message: err.message,
            })
        }
    }
}

const adminIsLoggedIn=(adminRoll)=>{
    return async (req,res,next)=>{
            try{
                
                
                const token =req.cookies.authorization;
                
                if(token==undefined){
                    next()
                    return
                }
                const userInfo = await jwt.verify(token, process.env.JWT_SECRET)
                // console.log(userInfo,"jitul");
                if(userInfo!==undefined){
                    if(adminRoll.includes(Role.Owner)&& userInfo.username===process.env.OWNER_USERNAME &&
                userInfo.password===process.env.OWNER_PASSWORD){
                   return res.redirect("/admin/dashboard")
                    
                }
                else if(adminRoll.includes(Role.Moderator)){
                    const admin = await Admin.findById(userInfo._id);
                    if(!admin){
                        throw new Error('Admin Not Found')
                    }
                    return  res.redirect("/admin/dashboard")
                    
                }
                
             }
            }
            catch(error){
                res.status(401).json({
                    error: true,
                    message: error.message,
                })   
            }
    }
}

module.exports = {
    adminAuth,
    Role,
    adminIsLoggedIn
}