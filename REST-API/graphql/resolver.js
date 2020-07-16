const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = require("../modals/user");

module.exports = {
  createUser: async function({ userInput }, req) {
    const email = userInput.email;
    const name = userInput.name;
    const password = userInput.password;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "Email is invalid" });
    }
    if (validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })) {
      errors.push({ message: "Password is too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      const error = new Error("E-Mail address is already exist.");
      throw error;
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashPassword,
    });
    const saveUser = await user.save();
    return { ...saveUser._doc, _id: saveUser._id.toString() };
  },
};