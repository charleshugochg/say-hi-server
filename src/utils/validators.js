const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports.registerInputValidator = ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "username must not be empty.";
  }
  if (email.trim() === "") {
    errors.email = "email must not be empty.";
  } else if (!email.match(mailFormat)) {
    errors.email = "email is not valid.";
  }
  if (password === "") {
    errors.password = "password must not be empty.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "passwords must be matched.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports.loginInputValidator = ({ username, password }) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "username must not be empty.";
  }
  if (password === "") {
    errors.password = "password must not be empty.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports.bodyInputValidator = ({ body }) => {
  const errors = {};
  if (body.trim() === "") {
    errors.body = "body must not be empty.";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
