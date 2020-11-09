const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')

module.exports = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if(allowedRoles instanceof String) {
                allowedRoles = [allowedRoles]
            }
            // Get the data from the authorization cookies
            const token = req.cookies.authorization
            const userInfo = await jwt.verify(token, process.env.JWT_SECRET)
            // if the allowedRoles contains owner and current user is owner, call next()
            if(allowedRoles.includes("owner") && 
               userInfo.username === process.env.OWNER_USERNAME && 
               userInfo.password === process.env.OWNER_PASSWORD
            )  {
                next()
            } else {
                // For another admin get the document from db and verify for each allowed role 
                const admin = await Admin.findById(userInfo._id)
                if(!admin) {
                    throw new Error('Admin Not Found')
                }
                for(role in allowedRoles) {
                    if(admin.role === role) {
                        req.adminInfo = {
                            token: token,
                            admin: admin,
                        }
                        next();
                        break;
                    }
                }
            }
        } catch (err) {
            res.status(401).json({
                error: true,
                message: 'Login First',
            })
        }
    }
}

