const User = require('../models/User')

exports.login_post = async (req, res, next) => {
    try {
        const { password, sch_id } = req.body
        console.log("login route",req.body);
        let user = await User.findByCredentials(sch_id, password)
        const JWTtoken = await user.generateAuthToken()
        user = user.toJSON()
        res.cookie('authorization', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
        // res.status(200).json(user)
        res.redirect("/user/profile");
    } catch (error) {
        next(error)
    }
}

exports.register = async (req, res, next) => {
    try {
        const { name, password, sch_id } = req.body
        let user = await User.create({
            name,
            password,
            sch_id,
        })
        const JWTtoken = await user.generateAuthToken()
        user = await user.toJSON()
        res.cookie('authorization', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}
