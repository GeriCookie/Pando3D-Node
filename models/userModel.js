var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userModel = new Schema({
    username: String,
    nickname: String,
    passHash: String,
    image: String,
    token: String,
    email: String
});

module.exports = mongoose.model('User', userModel);
