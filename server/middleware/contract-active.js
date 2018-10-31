const {ObjectID} = require('mongodb');
var {Contract} = require('./../models/contract');

/**
 * Check whether the poster exists.
 * @param {*} request HTTP request
 * @param {*} response HTTP response
 * @param {*} next call next() to proceed
 */
module.exports = (request, response, next) => {
    var id = request.params.id;

    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    Contract.findOne({
        _id: id,
        active: true
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