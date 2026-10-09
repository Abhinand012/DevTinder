const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      maxLength: 20,
    },
    lastName: {
      type: String,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
        message: "Invalid email address",
      },
    },
    passWord: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password:" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate: {
        validator: (value) => {
          return ["male", "female", "other"].includes(value);
        },
        message: "gender must be male,female or other",
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate: {
        validator: (value) => {
          return validator.isURL(value);
        },
        message: "Invalid photo url",
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@Token123", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.verifyPassword = async function (passwordInput) {
  const user = this;
  const passwordHash = user.passWord;
  const isPasswordCorrect = await bcrypt.compare(passwordInput, passwordHash);
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
