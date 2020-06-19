const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongodbSession = require("connect-mongodb-session")(session);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controller/error");
const User = require("./models/user");
const MONGODB_URI = "mongodb+srv://m001-student:m001-mongodb-basics@cluster0-kjwk5.mongodb.net/nodeComplete";
const app = express();
const store = new MongodbSession({
  uri: MONGODB_URI,
  collection: "session",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  // User.findById("5eeb27ba7b28521e866884ea")
  //   .then((user) => {
  //     req.user = new User(user);
  //     next();
  //   })
  //   .catch((err) => console.log(err));
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Piyalee",
          email: "piyalee@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(4000);
  })
  .catch((err) => console.log(err));
