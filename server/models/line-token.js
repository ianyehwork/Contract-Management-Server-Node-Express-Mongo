const mongoose = require('mongoose');
const _ = require('lodash');

var LineTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: _.toInteger(process.env.PASSWORD_TOKEN_TTL_SECOND)
    },
    _customer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User'
    }
});

/**
 * Before the user is convertored into JSON object,
 * only the _id KVP is selected.
 */
LineTokenSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['token']);
};

var LineToken = mongoose.model('LineToken', LineTokenSchema);

module.exports = {
    LineToken
};