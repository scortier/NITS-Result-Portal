const User = require('../models/User')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.resultAuth
        const userInfo = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(userInfo._id)
        console.log(user)
        if (!user) {
            throw new Error('User not found')
        }

        //Remove token
        req.userInfo = {
            user: user
        }
        next()
    } catch (err) {
        res.redirect("/user/login");
    }
}

const isLoggedIn = async (req, res, next) => {
    const token = req.cookies.resultAuth

    if (token) {
        let userInfo = jwt.verify(token, process.env.JWT_SECRET)
        if(userInfo){
            let user = await User.findById(userInfo._id)
            res.render("profile",{user})
            return 
        }
    }
    next()
}

module.exports = { auth, isLoggedIn }
