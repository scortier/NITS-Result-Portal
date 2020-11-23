/** Write User routes here */
const router = require('express').Router()
const adminController = require('../controllers/admin')
const { adminAuth, Role ,adminIsLoggedIn} = require('../middlewares/adminAuth')

// owner
router.post('/owner/login', adminController.OwnerLogin)
router.post('/create', adminAuth(Role.Owner), adminController.CreateAdmin)
router.get('/owner/login',adminIsLoggedIn(Role.Owner),adminController.ownerLogin_get)

// moderator
router.post('/login',adminController.AdminLogin)
router.get('/login',adminIsLoggedIn(Role.Moderator),adminController.adminLogin_get)

// both
router.get('/dashboard',adminAuth([Role.Owner,Role.Moderator,Role.Viewer]),adminController.dashBoardLogin_get)
router.get('/logout',adminController.logout_get)

module.exports = router