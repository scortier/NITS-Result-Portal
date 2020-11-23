/** Write User routes here */
const router = require('express').Router()
const adminController = require('../controllers/admin')
const { adminAuth, Role } = require('../middlewares/adminAuth')

router.post('/owner/login', adminController.OwnerLogin)
router.post('/login', adminController.AdminLogin)
router.post('/create', adminAuth(Role.Owner), adminController.CreateAdmin)
router.get('/login', (req, res) => {
    res.render('adminLogin')
})
router.get('/owner/login', (req, res) => {
    res.render('ownerLogin')
})

router.get('/dashboard', adminAuth,(req, res) => {
    res.render("adminDashboard")
})

router.post('/result/upload', adminController.uploadResult_post)
module.exports = router