const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const dataExtraction = require('../../experiments/extract')
const forStudent = require('../utils/uploadResultUtil')
// const uploadResultUtil = require('../utils/uploadResultUtil')

module.exports.OwnerLogin = async (req, res, next) => {
    const { username, password } = req.body
    const ownerUsername = process.env.OWNER_USERNAME;
    const ownerPassword = process.env.OWNER_PASSWORD;

    try {
        if (username === ownerUsername && password === ownerPassword) {
            const token = jwt.sign(
                {
                    username: ownerUsername,
                    password: ownerPassword,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRE,
                }
            )
            res.cookie('authorization', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            })
            // dashboard
            req.flash('message','logged in sucessfully')   
            res.redirect('/admin/dashboard')
        } else {
            const err = new Error('Invalid Owner Credetials')
            err.statusCode = 403
            throw err
        }
    } catch (error) {
        // next(error)
        req.flash('message', 'Wrong username or password')
        res.render('ownerLogin', { flash: { message: req.flash('message') } })
    }
}
exports.AdminLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body
        
        let admin = await Admin.findByCredentials(username, password)
        const JWTtoken = await admin.generateAuthToken()
        admin = admin.toJSON()
        res.cookie('authorization', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
            req.flash('message', 'logged in sucessfully');   
            res.redirect('/admin/dashboard')
    
    } catch (error) {

        req.flash('message', 'Wrong username or password')
        res.render('adminLogin', { flash: { message: req.flash('message') } })
        
    }
}

exports.CreateAdmin = async (req, res, next) => {
    try {
        const { username, password, role } = req.body
        let admin = await Admin.create({
            username,
            password,
            role,
        })
        const JWTtoken = await admin.generateAuthToken()
        admin = admin.toJSON()

        res.cookie('authorization', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
        // req.flash('message', 'logged in sucessfully');   
        // res.redirect('/admin/login')
    } catch (e) {
        next(e)
    }
}
//  gets
exports.adminLogin_get = async (req, res, next) => {
    try{
        req.flash('message', '')
        res.render('adminLogin', { flash: { message: req.flash('message') } })
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.ownerLogin_get = async (req, res, next) => {
    try {
        req.flash('message', '')
        res.render('ownerLogin', { flash: { message: req.flash('message') } })
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.dashBoardLogin_get = async (req, res, next) => {
    try {

        res.render('adminDashboard')

    } catch (error) {
        console.log(error)
        next()
    }
}

exports.logout_get = async (req, res, next) => {
    try {
        res.clearCookie('authorization').redirect('/admin/login')
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.uploadResult_post = async (req, res, next) => {
    try {
        console.log('Started Controller')
        let { sem, branch, year } = req.body
        let students = await dataExtraction()

        console.log('Found data from csv', students)

        students.forEach(async (student) => {
            console.log(student)
            await forStudent(student, branch, sem, year)
        })
        res.status(200).send({ message: 'successful' })
    } catch (error) {
        console.log(error)
        next()
    }
}
