const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mainRouter = require('./routes/main');
const userRouter = require('./routes/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRouter);
app.use(mainRouter.router);

app.use((req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(4000);