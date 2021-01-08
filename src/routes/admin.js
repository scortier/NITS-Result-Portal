/** Write User routes here */
const router = require('express').Router()
const adminController = require('../controllers/admin')
const { adminAuth, Role, adminIsLoggedIn } = require('../middlewares/adminAuth')
const uploadCsvFile = require('../utils/multer')

// owner
router.post('/owner/login', adminController.OwnerLogin)
router.post('/create', adminAuth(Role.Owner), adminController.CreateAdmin)
router.get(
    '/owner/login',
    adminIsLoggedIn(Role.Owner),
    adminController.ownerLogin_get
)

// moderator
router.post('/login', adminController.AdminLogin)
router.get(
    '/login',
    adminIsLoggedIn(Role.Moderator),
    adminController.adminLogin_get
)

// both
router.get(
    '/dashboard',
    adminAuth([Role.Owner, Role.Moderator, Role.Viewer]),
    adminController.dashBoardLogin_get
)
router.get('/logout', adminController.logout_get)

router.post(
    '/result/upload',
    uploadCsvFile.single('csvfile'),
    adminController.uploadResult_post
)

router.get('/result/upload', (req, res) => {
    res.render('upload')
})
// router.post('/result/upload/csv', uploadCsvFile.single('csvfile'), (req, res)=>{
//     console.log("File uploaded successfully");
//     res.status(200).send("Uploaded")
// })
router.post('/upload/test', (req, res) => {
    console.log(req.body)
    res.sendStatus(200)
})

module.exports = router
