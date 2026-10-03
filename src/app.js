const express = require("express");

const app = express();

function authenticate(req, res, next) {
  const key = req.headers["x-api-key"];
  console.log(key);
  if (key === "mysecret123") {
    next();
  } else if (!key) {
    res.status(401).send("API key required");
  } else {
    res.status(401).send("Invalid API key");
  }
}

app.get("/admin", authenticate, (req, res) => {
  res.send("Welcome Admin");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
