const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateEditProfileData,
  nameValidation,
  passwordValidation,
} = require("../utils/validation");

//profile api to get user details
profileRouter.get("/profile/view", adminAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//patch profile/edit api to path the user data
profileRouter.patch("/profile/edit", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    validateEditProfileData(req);
    nameValidation(req.body.firstName);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    loggedInUser.save();
    res.send("user data updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//profile/password api to update password
profileRouter.patch("/profile/password", adminAuth, async (req, res) => {
  try {
    const user = req.user;
    const oldPassword = req.body.password;
    const newPassword = req.body.newpassword;
    passwordValidation(newPassword);
    const isPasswordCorrect = await user.verifyPassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new Error("password not authenticated");
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    user.save();
    res.json({
      message: "password updated successfully",
      password: newPasswordHash,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//update user api to update all the data in a user
profileRouter.put("/user", adminAuth, async (req, res) => {
  const userId = req.user._id;
  const data = req.body;
  try {
    const user = await User.findOneAndReplace({ _id: userId }, data);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("user data updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});
//delete user api to delete the user
profileRouter.delete("/user", adminAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("user data deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = profileRouter;
