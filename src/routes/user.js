/** Write User routes here */
const router = require('express').Router()
const userController = require('../controllers/user')

router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/login',(req,res)=>{
    
})
router.get('/register',(req,res)=>{

})


module.exports = router