var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = require('../models/comment').schema;

var Clip = new Schema({
    title: String,
    url: String,
    team: String,
    user: String,
    videoID: String,
    comments: [CommentSchema],
    editable: Boolean
});

module.exports = mongoose.model('Clip', Clip);
