const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var adminSchema = new Schema({
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }

});
var adminModel = mongoose.model('adminCredentials', adminSchema);

module.exports = adminModel;