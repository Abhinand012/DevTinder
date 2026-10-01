const express = require("express");

const app = express();
app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/users", (req, res) => {
  res.send("Users");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
