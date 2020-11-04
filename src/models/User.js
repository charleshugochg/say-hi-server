const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: String,
  email: String,
  passwordHash: String,
  createdAt: String,
});

module.exports = model("User", userSchema);
