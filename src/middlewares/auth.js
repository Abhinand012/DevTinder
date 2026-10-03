const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isValidAuth = token === "xyz";
  if (isValidAuth) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = { adminAuth };
