/**
 * This file represents the model for User collection.
 */

const mongoose = require('mongoose');
const _ = require('lodash');

var UserAuthSchema = new mongoose.Schema({
    access: {
        type: String,
        required: true
    }, 
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: _.toInteger(process.env.AUTH_TOKEN_TTL_SECOND)
    },
    _owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User'
    }
});

var UserAuth = mongoose.model('UserAuth', UserAuthSchema);


module.exports = {
    UserAuth
};