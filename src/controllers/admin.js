const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const dataExtraction = require('../../experiments/extract')
const forEveryStudent = require('../utils/uploadResultUtil')
const uploadResultUtil = require('../utils/uploadResultUtil')

module.exports.OwnerLogin = async (req, res, next) => {
    const { username, password } = req.body
    const ownerUsername = process.env.OWNER_USERNAME
    const ownerPassword = process.env.OWNER_PASSWORD
    console.log(req.body.username)
    console.log(ownerUsername)
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
                maxAge: 24 * 60 * 60,
            })
            // dashboard
            res.redirect('/admin/dashboard')
        } else {
            const err = new Error('Invalid Owner Credetials')
            err.statusCode = 403
            throw err
        }
    } catch (error) {
        next(error)
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
        res.status(200).json(admin)
    } catch (error) {
        next(error)
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
        res.status(201).json(admin)
    } catch (e) {
        next(e)
    }
}

exports.uploadResult_post = async (req, res, next) => {
    try {
        let { sem, branch, year } = req.body
        let students = await dataExtraction()

        students.forEach(async (student) => {
            await uploadResultUtil(student, branch, sem, year)
        })
        res.status(200).send({message: "successful"})
    } catch (error) {
        console.log(error)
        next()
    }
}
