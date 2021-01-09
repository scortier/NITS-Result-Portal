const User = require('../models/User')
const crypto = require('crypto')
// TODO: uncomment the smtpTransport
// const smtpTransport = require('../utils/email')

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
        res.render('settings', { user: req.userInfo.user,flash:false })
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

exports.editProfileCredentials = async (req, res) => {
    try {
        const {currentPassword,newPassword,confirmPassword}=req.body;
        if(newPassword!==confirmPassword){
            req.flash('message', 'New password does not match with the confrim password');
            res.render('settings',{user:req.userInfo.user,
                flash: { message: req.flash('message') },
            })
        }else{
            const userinfo = await User.findById(req.params.userId)
            const user=await userinfo.checkAndUpdate(currentPassword,newPassword);
            if(user==true){
                req.flash('message', 'Password changed sucessfully');
                res.render('settings',{user:req.userInfo.user,
                    flash:false,
                    flashMessages: { message: req.flash('message'),
                     }
                })
            }else{
                req.flash('message', 'Password is incorrect');
                res.render('settings',{user:req.userInfo.user,
                    flash: { message: req.flash('message') },
                })
            }
        }

  
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}


exports.getForgotPasswordForm = (req, res) => {
    res.render('./forgotPassword', { flash: { message: req.flash('message') } })
}

exports.getPasswordResetForm = async (req, res) => {
    const user = await User.findOne({ sch_id: req.params.sch_id })
    const sch_id = user.sch_id
    const resetToken = req.params.token
    res.render('./resetPassword', {
        flash: { message: req.flash('message') },
        sch_id,
        resetToken,
    })
}

exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        //TODO: send flash message
        return res.send('No user found')
    }
    const email = req.body.email
    const sch_id = user.sch_id
    console.log(user.passwordResetExpires)
    const dt = new Date(user.passwordResetExpires).getTime()
    if (
        (user.passwordResetToken && dt > Date.now()) ||
        !user.passwordResetToken
    ) {
        const resetToken = user.createPasswordResetToken()
        await user.save({ validateBeforeSave: false })
        try {
            //TODO: change this url before going to production
            // res.send(`http://localhost:5000/user/resetPassword/${sch_id}/${resetToken}`)
            const mailOptions = {
                from: 'example@gmail.com',
                to: `${email}`,
                subject: 'Reset Password',
                generateTextFromHTML: true,
                html: `<!DOCTYPE html>~
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email</title>
                </head>
                <body style="margin:0;padding:0;" >
                <h2>
                http://localhost:5000/user/resetPassword/${sch_id}/${resetToken}
                </h2>
                </body>
                </html>`,
            }
            res.render('dummyPasswordReset', {
                sch_id,
                resetToken,
            })
            // smtpTransport.sendMail(mailOptions, (error, response) => {
            //     smtpTransport.close()
            //     res.render('Sent')
            // })
        } catch (err) {
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })
            return res.status(500).json({
                status: 'fail',
                message: 'Error in sending email',
            })
        }
    } else {
        res.send(
            'Email Already sent. Please wait for some time to resend email'
        )
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex')
        const user = await User.findOne({
            sch_id: req.params.sch_id,
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
        const JWTtoken = await user.generateAuthToken()
        // user = user.toJSON()
        res.cookie('resultAuth', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
        // req.flash('message', 'Logged in sucessfully')
        res.render('profile', {
            user,
            flashMessages: { message: req.flash('message') },
        })
    } catch (err) {
        res.send(err)

    }
}
