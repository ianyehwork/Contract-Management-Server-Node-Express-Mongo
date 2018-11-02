const mongoose = require('mongoose');
const _ = require('lodash');

const ContractSchema = new mongoose.Schema({
    _customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Customer Id is required.'],
        ref:'Customer'
    },
    _lot: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Parking Lot Id is required.'],
        ref:'ParkingLot'
    },
    sYear: {
        type: Number,
        required: true
    },
    sMonth: {
        type: Number,
        required: true
    },
    sDay: {
        type: Number,
        required: true
    },
    pFrequency: {
        type: Number,
        required: true
    },
    pYear: {
        type: Number,
        required: true
    },
    pMonth: {
        type: Number,
        required: true
    },
    pDay: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    },
    pTotal: {
        type: Number,
        required: true,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    }
});

ContractSchema.methods.toJSON = function(){
    var model = this;
    var modelObject = model.toObject();
    var obj = _.pick(modelObject, [
        '_id',
        '_customer',
        '_lot',
        'sYear',
        'sMonth',
        'sDay',
        'pFrequency',
        'pYear',
        'pMonth',
        'pDay',
        'comment',
        'active',
        'pTotal',
        'dateCreated',
        'dateModified'
    ]);
    return obj;
};

// This represents the entire collection of data
const Contract = mongoose.model("Contract", ContractSchema);

// Only export the model class
module.exports = {
    Contract
};