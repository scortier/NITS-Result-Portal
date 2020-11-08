/** Write User routes here */
const router = require('express').Router()
const adminController = require('../controllers/admin')

router.post('/owner/login', adminController.OwnerLogin)
router.post('/register', adminController.register)

router.get('/login',(req,res)=>{
    
})
router.get('/register',(req,res)=>{

})


module.exports = router