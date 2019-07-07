var mongoose = require('mongoose');
var categorySchema = mongoose.Schema({
    name:String
});

var category = module.exports = mongoose.model('category' , categorySchema);
module.exports.category = function( callback){
    category.find({} , callback);
};
