var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    bookmark: {
        type: Array
    }
});

var User =  mongoose.model('User', UserSchema);
module.exports = User;
module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};
module.exports.bookmark = function(bookmark, id , user ){
    bookmark.push(id);
    var myquery = { username: user.username };
    var newvalues = { $set: { bookmark: bookmark} };
    User.updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated" );
    });
};
module.exports.removeBookmark = function(bookmark, id , user ){
    var del = bookmark.indexOf(id);
    delete bookmark[del];
    bookmark = bookmark.filter(Boolean);
    var myquery = { username: user.username };
    var newvalues = { $set: { bookmark: bookmark} };
    User.updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document deleted" );
    });
};
