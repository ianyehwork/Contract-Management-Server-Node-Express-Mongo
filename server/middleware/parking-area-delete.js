var {ParkingLot} = require('./../models/parking-lot');
const {ObjectID} = require('mongodb');

/**
 * Check whether there exists a parking lot associated
 * with the parking area before we delete it
 * @param {*} request HTTP request
 * @param {*} response HTTP response
 * @param {*} next call next() to proceed
 */
module.exports = (request, response, next) => {
    var id = request.params.id;

    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    ParkingLot.findOne({
        _area: id
    }).then((result) => {
        if(result) {
            return response.status(400).send();
        }
        next();
    }).catch((err) => {
        console.log(err);
        response.status(400).send();
    });
};