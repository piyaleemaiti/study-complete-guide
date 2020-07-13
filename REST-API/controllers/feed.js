const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Post = require("../modals/post");
const User = require("../modals/user");

exports.getPosts = async(req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find().populate('creator').skip((currentPage - 1) * perPage).limit(perPage);
    res.status(200).json({ posts: posts, totalItems });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Post fetched!", post: post });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};

exports.createPost = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, enter data correctly");
    error.statusCode = 422;
    throw error;
  }
  if (!image) {
    const error = new Error("No image found!");
    error.statusCode = 422;
    throw error;
  }
  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: image.path,
    creator: req.userId,
  });
  try {
    const savePost = await post.save();
    const creator = await User.findById(req.userId);
    creator.posts.push(post);
    await creator.save();
    res.status(201).json({
      message: "Post created successfully!",
      post: post,
      creator: { _id: creator._id, name: creator.name },
    });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No image picked!");
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error("No post found!");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("No authorized!");
      error.statusCode = 404;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const savePost = await post.save();
    res.status(200).json({
      message: "Post updated successfully!",
      post: savePost,
    });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("No post found!");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("No authorized!");
      error.statusCode = 404;
      throw error;
    }
    clearImage(post.imageUrl);
    const deletePost = await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    const saveUSer = await user.save();
    res.status(200).json({ message: "Post deleted successfully!" });
  }
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
