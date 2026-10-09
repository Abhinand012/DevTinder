const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token!!");
    }
    const { _id } = jwt.verify(token, "DevTinder@Token123");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

module.exports = { adminAuth };
