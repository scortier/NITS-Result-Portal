const express = require('express')
const router = express.Router()
const Auth = require('../middlewares/auth')
const { adminAuth, Role } = require('../middlewares/adminAuth')
const userRouter = require('./user')
const adminRouter = require('./admin')

router.use('/user', userRouter)
router.use('/admin', adminRouter)

router.get('/', (req, res) => {
    res.render('index')
})

// to test auth only
router.get(
    '/auth-test',
    adminAuth([Role.Viewer, Role.Moderator]),
    (req, res) => {
        res.send('Auth working ')
    }
)
router.get('*', (req, res, next) => {
    const error = new Error('Invalid Endpoint')
    error.statusCode = 404
    next(error)
})

router.use((error, req, res, next) => {
    console.error(error.message)
    res.status(error.statusCode || 500).json({
        error: true,
        message: error.message || 'An Error Occured',
        route: req.url,
    })
})

module.exports = router
