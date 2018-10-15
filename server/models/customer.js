/**
 * 1. Create the Javascript File for the new Schema
 */
const mongoose = require('mongoose');

const VehicleSchema = new Schema({
    vin: String
});

const CustomerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required.']
    },
    vehicles: [VehicleSchema],
    createAt: {
        type: Date,
        default: Date.now
    }
});

// This represents the entire collection of data
const Customer = mongoose.model("Customer", CustomerSchema);

// Only export the model class
module.exports = Customer;