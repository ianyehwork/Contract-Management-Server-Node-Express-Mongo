const mongoose = require('mongoose');
const _ = require('lodash');

var LoginTokenSchema = new mongoose.Schema({
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

var LoginToken = mongoose.model('LoginToken', LoginTokenSchema);

module.exports = {
    LoginToken
};