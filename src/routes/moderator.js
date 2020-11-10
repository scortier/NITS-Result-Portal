/** Write User routes here */
const router = require('express').Router()
const adminController = require('../controllers/admin')
const adminAuth=require("../middlewares/adminAuth");
const {Role} =require("../roles/role")

// router.post('/moderator/login',adminController.ModeratorLogin);

router.post('/login',adminController.ModeratorLogin);
router.get('/login',(req,res)=>{
    res.send("moderator login ");
});


router.get('/upload-results',adminAuth(Role.Owner),(req,res)=>{
    res.send("result uploaded")
});

router.post('/upload-results',adminAuth(Role.Moderator),(req,res)=>{
        // upload csv file
});

module.exports = router