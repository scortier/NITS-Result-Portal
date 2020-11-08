/** Write User routes here */
const router = require('express').Router()
const adminController = require('../controllers/admin')
const Admin =require("../models/admin");
const adminAuth=require("../middlewares/adminAuth");
const {Role} =require("../roles/role")

router.post('/owner/login', adminController.OwnerLogin)
router.post('/register', adminController.register)

router.post('/moderator/login',adminController.ModeratorLogin);

router.get("/Admin/panel",adminAuth(Role.Moderator),(req,res,next)=>{
    res.send("admin panel");
})

router.get('/login',(req,res)=>{
    
})
router.get('/register',(req,res)=>{

})


module.exports = router