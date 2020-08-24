const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

require('dotenv').config();
require('./config/passport');

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(expressLayouts);
app.set("view engine", 'ejs');


app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized:true,
  resave:false,
}));

app.use(flash());
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});




const articles = require('./routes/articles');
const dashboard = require('./routes/dashboard');
const users = require('./routes/users');

app.use('/articles', articles);
app.use('/dashboard', dashboard);
app.use('/users', users);






app.listen(PORT, ()=>{console.log('SERVER LISTENING ON PORT: ' + PORT);});