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
    if (req.body.firstName) {
      nameValidation(req.body.firstName);
    }
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send(loggedInUser);
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

module.exports = profileRouter;
