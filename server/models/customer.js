const mongoose = require('mongoose');
const _ = require('lodash');

const VehicleSchema = new mongoose.Schema({
    vin: {
        type: String,
        required: [true, 'Vehicle Number is required.'],
        minlength: 1,
        trim: true
    }
});

const CustomerSchema = new mongoose.Schema({
    pContact: {
        type: String,
        required: [true, 'Primary Contact is required.'],
        minlength: 1,
        trim: true
    },
    sContact: {
        type: String,
        trim: true
    },
    pPhone: {
        type: String,
        required: [true, 'Primary Phone is required.'],
        minlength: 1,
        trim: true
    },
    sPhone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    vehicles: [VehicleSchema],
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    }
});

CustomerSchema.methods.toJSON = function(){
    var model = this;
    var modelObject = model.toObject();
    var obj = _.pick(modelObject, [
        '_id',
        'pContact', 
        'sContact', 
        'pPhone',
        'sPhone',
        'address'
    ]);
    obj.dateCreated = modelObject.dateCreated;
    obj.dateModified = modelObject.dateModified;
    obj.vehicles = [];
    _.forEach(modelObject.vehicles, (v) => {
        obj.vehicles.push(v.vin);
    });
    return obj;
};

// This represents the entire collection of data
const Customer = mongoose.model("Customer", CustomerSchema);

// Only export the model class
module.exports = {
    Customer
};