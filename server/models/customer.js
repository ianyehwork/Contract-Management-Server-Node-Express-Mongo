/**
 * 1. Create the Javascript File for the new Schema
 */
const mongoose = require('mongoose');

const VehicleSchema = new Schema({
    vin: {
        type: String,
        required: [true, 'Vehicle Number is required.'],
        minlength: 1,
        trim: true
    }
});

const CustomerSchema = new Schema({
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

// This represents the entire collection of data
const Customer = mongoose.model("Customer", CustomerSchema);

// Only export the model class
module.exports = Customer;