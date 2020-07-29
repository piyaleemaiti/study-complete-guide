const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");

const graphqlSchema = require("./graphql/schema");
const graphqlresolver = require("./graphql/resolver");
const auth = require("./middleware/isAuth");
const clearImage = require("./utills/file");

const MONGODB_URI =
  "mongodb+srv://m001-student:m001-mongodb-basics@cluster0-kjwk5.mongodb.net/postmessages";
const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.use('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not Authenticate!");
  }
  if (!req.file) {
    return res.status(200).json({ message: 'No file selected!' });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res.status(200).json({ message: 'File uploaded!', filePath: req.file.path });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlresolver,
    graphiql: true,
    customFormatErrorFn(err) {
      console.log('customFormatErrorFn', err);
      if (!err.originalError) {
        return err;
      }
      console.log('err', err);
      const data = err.originalError.data;
      const code = err.originalError.code || 500;
      const message = err.originalError.message || "An error occurred.";
      return { message, status: code, data };
    }
  }),
);

app.use((error, req, res, next) => {
  if (error) {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data });
  }
});

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
