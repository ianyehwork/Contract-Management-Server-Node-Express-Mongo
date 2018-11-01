const mongoose = require('mongoose');
const _ = require('lodash');

const PaymentSchema = new mongoose.Schema({
    _contract: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Contract Id is required.'],
        ref:'Contract'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        required: [true, 'Payment Type is required.'],
    },
    amount: {
        type: Number,
        required: [true, 'Payment Amount is required.'],
    },
    comment: {
        type: String,
        trim: true
    },
    dateModified: {
        type: Date,
        default: Date.now
    }
});

PaymentSchema.methods.toJSON = function(){
    var model = this;
    var modelObject = model.toObject();
    var obj = _.pick(modelObject, [
        '_id',
        '_contract',
        'dateCreated',
        'dateModified',
        'type',
        'amount',
        'comment'
    ]);
    return obj;
};

// This represents the entire collection of data
const Payment = mongoose.model("Payment", PaymentSchema);

// Only export the model class
module.exports = {
    Payment
};