const User = require('../models/User')

exports.login_get = async (req, res, next) => {
    try {
        req.flash('message', '')
        res.render('login', { flash: { message: req.flash('message') } })
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.logout_get = async (req, res, next) => {
    try {
        req.flash('message', 'Logout Sucessfull')
        res.clearCookie('resultAuth').redirect('/user/login')
    } catch (error) {
        console.log(error)
        next()
    }
}
exports.login_post = async (req, res, next) => {
    try {
        const { password, sch_id } = req.body
        // console.log("login route",req.body);
        let user = await User.findByCredentials(sch_id, password)
        const JWTtoken = await user.generateAuthToken()
        user = user.toJSON()
        res.cookie('resultAuth', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
        req.flash('message', 'Logged in sucessfully')
        res.render('profile', { user,flashMessages: { message: req.flash('message') } })
        
    } catch (error) {
        req.flash('message', 'Wrong username or password')
        res.render('login', { flash: { message: req.flash('message') } })
        // next(error)
    }
}

exports.profile_get = async (req, res, next) => {
    try {
        res.render('profile', { user: req.userInfo.user })
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.settings_get = async (req, res, next) => {
    try {
        res.render('settings', { user: req.userInfo.user })
    } catch (error) {
        console.error(error)
        next()
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
        res.cookie('resultAuth', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}
