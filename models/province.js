var mongoose = require('mongoose');
var provinceSchema = mongoose.Schema({
    name:String
});
var province = module.exports = mongoose.model('province' , provinceSchema);
module.exports.province = function( callback){
    province.find({} , callback);
    console.log(callback)
};
