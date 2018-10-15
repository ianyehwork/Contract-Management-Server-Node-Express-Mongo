const { Poster } = require('./../models/poster');
const {ObjectID} = require('mongodb');

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

    Poster.findOne({
        _id: id,
        _creator: request.user._id
    }).then((poster) => {
        if(!poster) {
            return response.status(404).send();
        }
        next();
    }).catch((err) => {
        console.log(err);
        response.status(400).send();
    });
};