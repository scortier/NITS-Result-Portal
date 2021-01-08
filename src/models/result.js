const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema(
    {
        semester: {
            type: Number,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        subjects: [
            {
                subCode: String,
                subName: String,
                subCredit: String,
                subGrade: String,
                subPointer: Number,
            },
        ],
        gp: {
            type: Number,
            required: true,
        },
        sgpa: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = Result = mongoose.model('Result', resultSchema)
