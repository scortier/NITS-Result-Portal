const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let directory = path.join(__dirname, '../../public/fileUploads')
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true }, (error) => {
                if (err) {
                    console.log('Unable to create directory')
                }
            })
        }
        callback(null, directory)
    },
    filename: (req, file, callback) => {
        callback(
            null,
            `${req.body.branch}-SEM-${req.body.sem}-${req.body.year}${path.extname(
                file.originalname
            )}`
        )
    },
})

const checkFileType = (file, cb) => {
    const filetypes = /csv/
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb(null, false)
    }
}

const uploadCsvFile = multer({
    storage,
    limits: {
        fileSize: 10000000,
    },
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback)
    },
})

module.exports = uploadCsvFile
