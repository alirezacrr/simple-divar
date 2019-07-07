var mongoose = require('mongoose');


var adverSchema = new mongoose.Schema({
    type: String,
    firstName: String,
    email: String,
    swap: String,
    province: String,
    price: String,
    titleAdver: String,
    descriptionAdver: String,
    img: String,
    id: String,
    date: String,
    category: String,
    username:String
});


var advertising = mongoose.model('adver', adverSchema);
module.exports = advertising;


module.exports.createAdver = function (newUser, callback) {
    newUser.save(callback);
};
module.exports.finding = function ( callback) {
    advertising.find({} , callback);

};
module.exports.getAdverByUsername = function (username,callback) {
    var query = {username: username};
    advertising.find(query, callback)
};

module.exports.date = function date() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var time = h + ":" + m + ":" + s;
    today = mm + '/' + dd + '/' + yyyy + ' ' + time;
    return today
};
