const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema(
    {
        sch_id: {
            type: Number,
            unique: true,
        },
        password: {
            type: String,
            // required: true,
        },
        profileImage: {
            type: String,
        },
        name: {
            type: String,
            // required: [true, 'is required'],
        },
        email: {
            type: String,
            required: true,
        },
        cgpa: {
            type: Number,
            // required: true,
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
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

// generate passwordResetToken
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

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

userSchema.methods.checkAndUpdate=async function(currentPassword,newPassword){
    const user=this;
    const isMatch = await bcrypt.compare(currentPassword, user.password)
   if(!isMatch){
        throw new Error('Unable to login')
   }
   else{
    user.password=newPassword;
   await user.save();
    return user;
   }
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
