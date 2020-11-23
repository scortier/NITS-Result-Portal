const User = require('../models/User')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.authorization
        const userInfo = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(userInfo._id)
        console.log(user)
        if (!user) {
            throw new Error('User not found')
        }

        //Remove token 
        req.userInfo = {
            token: token,
            user: user,
        }
        next()
    } catch (err) {
        res.status(401).json({
            error: true,
            message: 'Login First',
        })
    }
}

const isLoggedIn = async(req, res, next)=>{
    try{
        const token = req.cookies.authorization
        const userInfo = jwt.verify(token, process.env.JWT_SECRET)
        if(!userInfo){
            next()
            return 
        }
        const user = await User.findById(userInfo._id)
        if(!user){
            console.log("User not found")
            next()
            return 
        }
        res.redirect("/user/profile")

    }catch(error){
        console.log("Error from isLoggedIn middleware", error)
    }

}

module.exports = {auth, isLoggedIn}