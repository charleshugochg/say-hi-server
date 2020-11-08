const { UserInputError } = require("apollo-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const {
  registerInputValidator,
  loginInputValidator,
} = require("../../utils/validators");

const { SECRET_KEY } = require("../../../config");

const generateJwt = (doc) => {
  // generate jwt
  const token = jwt.sign(
    {
      id: doc._id,
      username: doc.username,
      email: doc.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    SECRET_KEY
  );
  return token;
};

module.exports = {
  Mutation: {
    register: async (_, { username, email, password, confirmPassword }) => {
      // validate
      const { valid, errors } = registerInputValidator({
        username,
        email,
        password,
        confirmPassword,
      });
      if (!valid) {
        throw new UserInputError("Validation failed.", {
          errors,
        });
      }
      // check already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("username is already taken.", {
          errors: {
            username: "username is already taken.",
          },
        });
      }
      // hash password and create user
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      // generate jwt
      const token = generateJwt(res);

      return {
        id: res._id,
        token,
        ...res._doc,
      };
    },
    login: async (_, { username, password }) => {
      // validate login input
      const { valid, errors } = loginInputValidator({ username, password });
      if (!valid) {
        throw new UserInputError("Validation Error", {
          errors,
        });
      }
      // check username exists
      const user = await User.findOne({ username });
      if (!user) {
        throw new UserInputError("Wrong username or password", {
          errors: {
            general: "wrong username or password",
          },
        });
      }
      // verify password
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        throw new UserInputError("Wrong username or password", {
          errors: {
            general: "wrong username or password",
          },
        });
      }
      // generate token
      const token = generateJwt(user);

      return {
        id: user._id,
        token,
        ...user._doc,
      };
    },
  },
};
