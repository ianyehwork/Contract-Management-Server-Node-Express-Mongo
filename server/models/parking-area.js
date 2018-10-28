const mongoose = require('mongoose');
const _ = require('lodash');

const ParkingAreaSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: [true, 'Identifier is required.'],
        minlength: 1,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    defaultDeposit: {
        type: Number
    },
    defaultRent: {
        type: Number
    },
    comment: {
        type: String,
        trim: true
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

ParkingAreaSchema.methods.toJSON = function(){
    var model = this;
    var modelObject = model.toObject();
    var obj = _.pick(modelObject, [
        '_id',
        'identifier', 
        'address',
        'defaultDeposit', 
        'defaultRent',
        'comment'
    ]);
    obj.dateCreated = modelObject.dateCreated;
    obj.dateModified = modelObject.dateCreated;
    return obj;
};

// This represents the entire collection of data
const ParkingArea = mongoose.model("ParkingArea", ParkingAreaSchema);

// Only export the model class
module.exports = {
    ParkingArea
};