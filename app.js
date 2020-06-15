const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const mongoclient = require("./util/database").mongoclient;
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controller/error");
const User = require('./models/user');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5ee60eeb643f51e1241ec857")
  .then(user => {
    req.user = new User(user);
    next();
  })
  .catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoclient(() => {
  app.listen(4000);
});
