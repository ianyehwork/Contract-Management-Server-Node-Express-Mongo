const mongoose = require('mongoose');
const _ = require('lodash');

var PasswordTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: _.toInteger(process.env.PASSWORD_TOKEN_TTL_SECOND)
    },
    _owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User'
    }
});

var PasswordToken = mongoose.model('PasswordToken', PasswordTokenSchema);

module.exports = {
    PasswordToken
};