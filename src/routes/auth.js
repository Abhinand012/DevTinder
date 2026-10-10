const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

//signup api to push new data into the database
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    //validation of data
    validateSignUpData(req);
    //password encryption
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//login api to login the user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }
    //jwt token creation
    const token = await user.getJWT();
    res.cookie("token", token);
    res.send("Login successful");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("logout successful");
});

module.exports = authRouter;
