var passport = require('passport');
var LocalStrat = require('passport-local').Strategy;

// Passport config
var User = require('../models/user');
passport.use(new LocalStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
