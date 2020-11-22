/** Write User routes here */
const router = require('express').Router()
const adminController = require('../controllers/admin')
const {adminAuth, Role}=require("../middlewares/adminAuth");

router.post('/owner/login', adminController.OwnerLogin)
router.post('/login', adminController.AdminLogin)
router.post('/create', adminAuth(Role.Owner), adminController.CreateAdmin)

router.get('/login',(req,res)=>{
    res.send("owner login");
})

router.get('/register',(req,res)=>{
    res.send("owner login");
});

module.exports = router