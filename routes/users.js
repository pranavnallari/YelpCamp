const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users')
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.route('/register')
.get(users.renderRegister)
.post(catchAsync(users.registerUser))

router.route('/login')
.get(users.renderLogin)
.post(storeReturnTo, passport.authenticate('local',{function (e){
    req.flash('error',e.message);
},failureFlash:true,failureRedirect:'/login'}),users.loginUser)

router.get('/logout', users.logoutUser);

module.exports = router;