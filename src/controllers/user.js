const User = require('../models/User')
const crypto = require('crypto')

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
        req.flash('message', 'Logged out successfully')
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
        res.render('profile', {
            user,
            flashMessages: { message: req.flash('message') },
        })
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

exports.changeProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            res.status(400).json({
                status: 'fail',
                message: 'No user found',
            })
        }
        user.profileImage = req.file.location
        await user.save()
        res.render('./settings', { user })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        res.status(400).json({
            status: 'fail',
            message: 'No such user exists',
        })
    }

    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    //TODO: Send password reset token to users email
    try {
        //
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })
        return res.status(500).json({
            status: 'fail',
            message: 'Error in sending email',
        })
    }
}

exports.resetPassword = async (req, res) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
        return res.send('No user found')
    }
    user.password = req.body.password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    // TODO: send jwt token to logged in user
}
