const {User, UserRoleEnum} = require('./../models/user');
const {UserAuth} = require('./../models/user_auth');
const jwt = require('jsonwebtoken');

/**
 * Check whether the user is authenticated.
 * Check whether the user.role is admin.
 * @param {*} request HTTP request
 * @param {*} response HTTP response
 * @param {*} next call next() to proceed
 */
var authenticate_admin = (request, response, next) => {
    // Retrieve JWT token from the request header
    var token = request.header(process.env.AUTH_HEADER);
    try { 
        // Returns the payload decoded if the signature is valid and 
        // optional expiration, audience, or issuer are valid.
        // If not, it will throw the error.
        jwt.verify(token, process.env.JWT_SECRET);
        // Check if there is a user corresponding to this JWT token
        UserAuth.findOne({token}).then((auth) => {
            if(!auth){
                return Promise.reject();
            }
            request.token = token;
            return Promise.resolve(auth);
        }).then((auth) => {
            User.findById(auth._owner).then((user) => {
                if(!user || user.role !== UserRoleEnum.ADMIN){
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

module.exports = {
    authenticate_admin
};