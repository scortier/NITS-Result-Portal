/** Write User routes here */
const router = require('express').Router()
const adminController = require('../controllers/admin')

router.post('/admin/owner/login', adminController.OwnerLogin)
router.post('/admin/login', adminController.AdminLogin)
router.post('/register', adminController.register)

router.get('/login',(req,res)=>{

})
router.get('/register',(req,res)=>{

})

module.exports = router