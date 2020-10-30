const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    scholar_id: {
      type: Number,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    passwordConfirm: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
