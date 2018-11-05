var {ParkingLot} = require('../models/parking-lot');
const {ObjectID} = require('mongodb');

/**
 * Check whether the parking lot is available before
 * we assign it to the contract.
 * @param {*} request HTTP request
 * @param {*} response HTTP response
 * @param {*} next call next() to proceed
 */
module.exports = (request, response, next) => {
    var id = request.body._lot._id;

    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    ParkingLot.findOne({
        _id: id,
        status: true
    }).then((result) => {
        if(!result) {
            return response.status(400).send();
        }
        next();
    }).catch((err) => {
        console.log(err);
        response.status(400).send();
    });
};