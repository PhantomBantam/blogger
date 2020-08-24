const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcrypt');


const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());


router.get('/register', (req, res)=>{
  res.render('register');
})

router.get('/login', (req, res)=>{
  res.render('login');
})

router.get('/forgot', (req, res)=>{ 
  res.render('forgot');
})

router.get('/reset', (req, res)=>{
  res.render('reset');
})

router.get('/logout', (req,res)=>{
  req.logout();
  req.flash('success_msg', 'You have logged out');
  res.redirect('/users/login');
});

async function checkFields(email, password1, password2){
  return new Promise(async (resolve, reject)=>{
    let errors = [];
    if(password1 != password2){
      errors.push({msg:"Passwords don't match"})
    }else if(password1.length<6){
      errors.push({msg:"Password must be at least 6 characters"});
    }
    if(errors.length==0){
      let found = await User.findOne({email: email});
      if(found!=null){
        errors.push({msg: "Email already in use!"})
      }  
    }
    resolve(errors);
  });
}

router.post('/register', async (req, res)=>{
  let userInfo = (req.body);
  let errors = await checkFields(userInfo.email, userInfo.password1, userInfo.password2);
  if(errors.length==0){
    var SALT_FACTOR = 5;
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      bcrypt.hash(userInfo.password1, salt, function(err, hash) {
        let user = new User({
          email: userInfo.email,
          password: hash
        });
        console.log('done');
        user.save().then(()=>{
          req.flash('success_msg', 'You are registered and can now login');
          req.flash('error_msg', '');
          res.redirect("/users/login");  
        });
      });
    });
  }else{
    console.log(errors);
    res.render('register', {
      errors,
      email: userInfo.email,
      password1: userInfo.password1,
      password2: userInfo.password2
    });
  }

});

router.post('/login', async (req, res, next)=>{
  let userData = req.body;
  passport.authenticate('local', (err, user, info) => {
    if(info.message == "ok"){
      req.login(user, (err) => {    
        res.render('dashboard');
      })  
    } else{
      res.render('login', {
        email:userData.email,
        errors: [{msg: info.message}] 
      })
    }

  })(req, res, next);
});

router.post('/forgot', (req, res)=>{

});

router.post('/reset', (req, res)=>{

});

module.exports = router;