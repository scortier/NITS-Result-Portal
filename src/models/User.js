const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        sch_id: {
            type: Number,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
        },
        name: {
            type: String,
            required: [true, 'is required'],
        },
        cgpa: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        toObject: {
            virtuals: true,
        },
    }
)

userSchema.virtual('results', {
    ref: 'Result',
    localField: '_id',
    foreignField: 'student',
})

// generateAuthToken
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign(
        {
            _id: user._id.toString(),
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    )
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    return userObj
}

userSchema.statics.findByCredentials = async function (sch_id, passowrd) {
    const user = await User.findOne({
        sch_id,
    })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(passowrd, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

module.exports = User = mongoose.model('User', userSchema)
