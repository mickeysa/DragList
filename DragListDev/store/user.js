/**
 * User Model for database schema
 *
 * @exports User
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var AppUtil = require('../controller/AppUtil');
var userTypes = {
    STUDENT: "S",
    PROFESSOR: "P",
    USER:"U"
};

var user = new Schema({
    customerID: {type: String, required: true, index: true, unique: true},
    name: {type: String, required: true, trim: true, index: true},
    image: {type: String, required: false, 'default': "", trim: true},
    doneLogin: {type: Boolean, 'default': false},//save the user is done login before, // or account setup done
    lastSeen: {type: Number, required: false},///date when user last online
    email: {type: String, required: false, lowercase: true},
    sex: {type: String, required: false, uppercase: true},
    mobile: {type: String, required: false, lowercase: true},
    blocked: {type: Boolean, 'default': false},
    blockNote: {type: String},
    userType: {type: String, 'default': userTypes.STUDENT, required: true, uppercase: true},
    updateDate: {type: Number, required: false},///date when information updated
    createDate: {type: Number, required: true}
});
user.methods.isBlocked = function () {
    return this.blocked == true;
};

exports.User = mongoose.model('User', user);
exports.USER_TYPE = userTypes;