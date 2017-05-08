/**
 * Created by Suraj on 5/3/2017.
 */
var express = require('express');
var router = express.Router();
var User = require('../modals/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Cart = require('../modals/cart');
//var shopRoute = require('./shop');


router.get('/', ensureAuthenticated, function(req, res){
    console.log("Logged In");
    //console.log(req.user._id);
    res.redirect("/shop");
});

// Register
router.get('/register', function(req, res){
    res.render('home');
});

// Login
router.get('/login', function(req, res){
    res.render('home');
});

// Register User
router.post('/register', function(req, res){
    console.log();
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
        res.render('home',{
            errors:errors
        });
    } else {
        var newUser = new User({
            name: name,
            email:email,
            username: username,
            password: password
        });
        var userinfo = "";
        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
            //userinfo = user;
            var newCart = new Cart({
                cartOf: user._id
            });

            Cart.addCart(newCart, function (err, cart) {
                if(err)
                    throw err;
            });
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/');
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){

                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/',failureFlash: true}),
    function(req, res) {
        console.log(req.user);
        res.redirect('/');
    });

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');
    req.user = null;
    req.session.destroy(function (err) {
        if (err) throw err;
        res.redirect('/');
    });
});


function ensureAuthenticated (request, response, next){
    if(request.isAuthenticated()){
        return next();
    }else{
        response.render('home');
    }
};

module.exports = router;