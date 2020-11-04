const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../../config");

module.exports = ({ req }) => {
  const token = req.headers.authorization || "";
  let user;
  try {
    user = jwt.verify(token.split("Bearer ")[1], SECRET_KEY);
  } catch (err) {}
  return { user };
};
