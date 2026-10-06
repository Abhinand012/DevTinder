const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

//signup api to push new data into the database
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, passWord } = req.body;
    //validation of data
    validateSignUpData(req);
    //password encryption
    const passwordHash = await bcrypt.hash(passWord, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      passWord: passwordHash,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//login api to login the user
app.post("/login", async (req, res) => {
  try {
    const { email, passWord } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(passWord, user.passWord);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }
    res.send("Login successful");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//user api to get a user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//feed api to get all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//delete user api to delete the user
app.delete("/user", async (req, res) => {
  const userId = req.body.id;
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

//patch user api to path the user data
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    console.log("1");
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log("2");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("user data updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//update user api to update all the data in a user
app.put("/user", async (req, res) => {
  const userId = req.body.userId;
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
