const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Nikhil",
    lastName: "P",
    email: "nikhilnikhi@gmail.com",
    passWord: "Nikhil@123",
  });
  await user.save();
  res.send("User created successfully");
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
