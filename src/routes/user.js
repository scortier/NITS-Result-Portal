/** Write User routes here */
const router = require('express').Router()
const userController = require('../controllers/user')
const {auth,isLoggedIn}  = require("../middlewares/auth")

router.post('/login', userController.login_post)
router.post('/register', userController.register)

router.get('/login',isLoggedIn,(req, res) => {
    // console.log("logged in")
    res.render('login')
})
router.get('/logout', (req,res) => {
    res.clearCookie('authorization').redirect('/user/login');
    // console.log("logged out")
})
router.get('/profile',auth,(req,res)=>{
    res.render("profile",{user: req.userInfo.user})
})
router.get('/register',(req,res)=>{

})


module.exports = router