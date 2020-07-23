const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../modals/user");
const Post = require("../modals/post");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const email = userInput.email;
    const name = userInput.name;
    const password = userInput.password;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "Email is invalid" });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
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
  login: async function ({ email, password }, req) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found!");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password didn't match!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        password: user.password,
      },
      "secretPassPilu",
      { expiresIn: "1h" }
    );
    return { token, userId: user._id.toString() };
  },
  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not Aithenticate!");
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid." });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const creator = await User.findById(req.userId);
    if (!creator) {
      const error = new Error("No User found!");
      error.code = 401;
      throw error;
    }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator,
    });
    const savePost = await post.save();
    creator.posts.push(savePost);
    await creator.save();
    return {
      ...savePost._doc,
      _id: savePost._id.toString(),
      createdAt: savePost.createdAt.toISOString(),
    };
  },
  posts: async function ({ page = 1 }, req) {
    if (!req.isAuth) {
      const error = new Error("Not Aithenticate!");
      error.code = 401;
      throw error;
    }
    const perPage = 2;
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return {
      posts: posts.map((post) => ({
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
      })),
      totalItems,
    };
  },
};
