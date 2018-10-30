const mongoose = require('mongoose');
const _ = require('lodash');

const ParkingLotSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: [true, 'Identifier is required.'],
        minlength: 1,
        trim: true,
        unique: true
    },
    deposit: {
        type: Number,
        min: [0, 'Deposit cannot be negative.']
    },
    rent: {
        type: Number,
        min: [0, 'Rent cannot be negative.']
    },
    status: {
        type: Boolean,
        default: true
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
    },
    _area: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Parking Area Id is required.'],
        ref:'ParkingArea'
    }
});

ParkingLotSchema.methods.toJSON = function(){
    var model = this;
    var modelObject = model.toObject();
    var obj = _.pick(modelObject, [
        '_id',
        '_area',
        'identifier', 
        'deposit', 
        'rent',
        'status',
        'comment'
    ]);
    obj.dateCreated = modelObject.dateCreated;
    obj.dateModified = modelObject.dateCreated;
    return obj;
};

// This represents the entire collection of data
const ParkingLot = mongoose.model("ParkingLot", ParkingLotSchema);

// Only export the model class
module.exports = {
    ParkingLot
};