/** Write User routes here */
const router = require('express').Router()
const userController = require('../controllers/user')

router.get('/login', userController.login)
router.get('/register', userController.register)


module.exports = router