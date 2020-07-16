const bcrypt = require("bcryptjs");
const User = require("../modals/user");

module.exports = {
  createUser: async function({ userInput }, req) {
    const email = userInput.email;
    const name = userInput.name;
    const password = userInput.password;
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