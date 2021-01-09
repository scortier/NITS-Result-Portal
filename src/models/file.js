const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sem: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8],
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        enum: ['CE', 'CSE', 'ECE', 'EIE', 'EE', 'ME'],
        required: true,
    },
})

const File = new mongoose.model('File', fileSchema)
module.exports = File
