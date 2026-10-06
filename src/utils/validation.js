const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, passWord } = req.body;
  const nameregex = /^[A-Z][a-z A-Z]*$/;
  if (!nameregex.test(firstName) || !nameregex.test(lastName)) {
    throw new Error("Invalid name");
  } else if (!/^[a-z](\w+)@gmail\.com$/.test(email)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(passWord)) {
    throw new Error("Enter a strong password");
  }
};

module.exports = { validateSignUpData };
