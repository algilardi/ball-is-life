var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Clip = require('../models/clip')

var User = new Schema({
    username: String,
    password: String,
    team: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
