const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhinandabhik012_db_user:evIBBYalUQJ8kwK3@devtinder.g7iioig.mongodb.net/devTinder",
  );
};

module.exports = connectDB;

// db_password:evIBBYalUQJ8kwK3
