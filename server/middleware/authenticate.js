/**
 * The file represents an authentication middleware to protect
 * private routes.
 */
const {User} = require('./../models/user');
const {UserAuth} = require('./../models/user_auth');
const jwt = require('jsonwebtoken');

/**
 * Check whether the user is authenticated.
 * @param {*} request HTTP request
 * @param {*} response HTTP response
 * @param {*} next call next() to proceed
 */
module.exports = (request, response, next) => {
    // Retrieve JWT token from the request header
    var token = request.header(process.env.AUTH_HEADER);
    try { 
        // Returns the payload decoded if the signature is valid and 
        // optional expiration, audience, or issuer are valid.
        // If not, it will throw the error.
        jwt.verify(token, process.env.JWT_SECRET);
        // Check if there is an user._id corresponding to this JWT token
        UserAuth.findOne({token}).then((auth) => {
            if(!auth){
                return Promise.reject();
            }
            request.token = token;
            return Promise.resolve(auth);
        }).then((auth) => {
            // Check if there is a user corresponding to this user._id
            User.findById(auth._owner).then((user) => {
                if(!user){
                    return Promise.reject();
                }
                request.user = user;
                next();
            }).catch((error) => {
                response.status(401).send();
            });
        }).catch((error) => {
            response.status(401).send();
        });
    } catch (error) {
        response.status(401).send();
    }
};