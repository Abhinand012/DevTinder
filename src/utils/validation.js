const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  nameValidation(firstName);
  nameValidation(lastName);
  if (!/^[a-z](\w+)@gmail\.com$/.test(email)) {
    throw new Error("Invalid email");
  }
  passwordValidation(password);
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "age",
    "skills",
    "about",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );

  if (!isEditAllowed) {
    throw new Error("Not an allowed edit field");
  }
};

const nameValidation = (name) => {
  const nameregex = /^[A-Z][a-zA-Z]*$/;
  if (!nameregex.test(name)) {
    throw new Error("Invalid name!");
  }
};

const passwordValidation = (password) => {
  if (!validator.isStrongPassword(password)) {
    throw new Error("password should be strong!");
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  nameValidation,
  passwordValidation,
};
