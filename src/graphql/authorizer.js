const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../../config");

module.exports = ({ req }) => {
  let user;
  try {
    const token = req.headers.authorization || "";
    user = jwt.verify(token.split("Bearer ")[1], SECRET_KEY);
  } catch (err) {}
  return { user };
};
