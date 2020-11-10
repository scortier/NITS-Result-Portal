const mongoose=require('mongoose');
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken");

const adminSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true,
            minlength:8,
            trim:true,
        },
        role:{
            type:String,
            required:true
        },
    },
    {
        timestamps:true,
    }
);

adminSchema.methods.generateAuthToken=async function(){
    const admin=this;
    const token=jwt.sign({_id:admin._id.toString()},process.env.JWT_SECRET);
    // admin.tokens=admin.tokens.concat({token});
    // await admin.save();
    return token;
}
adminSchema.statics.findByCredentials = async function (username, password) {
    const admin = await Admin.findOne({ username })
  
    if (!admin) {
        throw new Error({message:'Admin not found'})
    }
  
    const isMatch = await bcrypt.compare(password, admin.password)
  
    if (!isMatch) {
        throw new Error({message:'password didnt match'})
    }
  
    return admin
  }
adminSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


// 
adminSchema.methods.toJSON = function () {
    const admin = this
    const adminObj = admin.toObject()
    delete adminObj.password
    return adminObj
}

const Admin=mongoose.model("Admin",adminSchema);
module.exports=Admin