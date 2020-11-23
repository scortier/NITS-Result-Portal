const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema(
    {
        semester :{
            type: Number,
            required: true
        },
        year:{
            type: Number,
            required:true
        },
        branch :{
            type: String,
            required: true
        },
        student:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
    
        subjects :[
            {
                type: String
            }
        ],
        gp: {
            type: Number,
            required: true
        },
        sgpa:{
            type: Number,
            required:true
        },
    },
    {
        timestamps: true,
    }
)

module.exports = User = mongoose.model('Result', resultSchema)
