/** Write User routes here */
const router = require('express').Router()
const adminController = require('../controllers/admin')
const adminAuth=require("../middlewares/adminAuth");
const {Role} =require("../roles/role")

router.post('/admin/owner/login', adminController.OwnerLogin)
router.post('/admin/login', adminController.AdminLogin)
router.post('/register', adminController.register)

router.get('/login',(req,res)=>{

})

router.get('/register',(req,res)=>{
    res.send("owner login");
});

// router.post('/register', adminController.register)





// create moderator
router.get("/owner/create-moderator",adminAuth(Role.Owner),(req,res,next)=>{
    res.send("moderator created");
});
router.post("/owner/create-moderator",adminAuth(Role.Owner),adminController.CreateModerator);


// router.get('/register',(req,res)=>{

// })

module.exports = router