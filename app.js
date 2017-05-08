/**
 * Created by Suraj on 5/3/2017.
 */
var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var expressValidator = require('express-validator');
var localStrategy = passportLocal.Strategy;
var path = require('path');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var flash = require('connect-flash');

//database connection to the "BOOKREAPER" DB
mongoose.connect('mongodb://localhost/bookreaper');
var db = mongoose.connection;

//Configure routes
var configRoutes = require('./routes');

//Init App
var app = express();

//Setting up secret key for password authentication
app.use(session({
    secret: "Bookreaper sample key",
    resave: true,
    saveUninitialized: false
}));

//Initializing passport
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.cart = req.cart || null;
    next();
});



app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');
configRoutes(app);

app.listen(3000, function(){
    console.log("The Server is up now and running at port 3000!");
});