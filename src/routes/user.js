/** Write User routes here */
const router = require('express').Router()
const userController = require('../controllers/user')
const {auth,isLoggedIn}  = require("../middlewares/auth")

router.post('/login', userController.login_post)
router.post('/register', userController.register)
router.get('/login',isLoggedIn, userController.login_get)
router.get('/logout', auth, userController.logout_get)
router.get('/profile',auth,userController.profile_get)
router.get('/settings', auth,userController.settings_get)



// router.get('/register',(req,res)=>{

// })


module.exports = router