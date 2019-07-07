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
    category: String
});


var advertising = mongoose.model('adver', adverSchema);
// module.exports = advertising;

class test {
    getAdverById = function (bookmarks, callback) {
        var bm = [];
        bookmarks.forEach(function (item) {
            var query = {id: item};
            advertising.findOne(query, function (err, adver) {
                bm.push(adver)
            });
        });
        console.log(bm);
        callback(bm)
    };
}
module.exports = test;
