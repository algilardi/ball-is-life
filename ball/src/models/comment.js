var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    user: String,
    text: String,
    editable: Boolean,
    commentID: String
});

module.exports = mongoose.model('Comment', Comment);
