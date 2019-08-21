/**
 * This file represents the REST API for User collection.
 * 
 * @author Tsu-Hsin Yeh
 */

const _ = require('lodash');
const { User } = require('./../models/user');
const { PasswordToken } = require('./../models/password-token');
const { LoginToken } = require('./../models/login-token');
const { generateRandomToken } = require('./../util/utility');
const { sendPasswordResetEmail, sendLoginTokenEmail } = require('./../email/email-service');
const { LineToken } = require('./../models/line-token');
const { Customer } = require('./../models/customer');
const bcrypt = require('bcryptjs');

/**
 * Create new user API
 * @param {*} request 
 * @param {*} response 
 */
const USER_CREATE_POST_API = (request, response) => {
    var body = _.pick(request.body, ['username', 'email', 'password']);
    var user = new User(body);
    user.save().then((user) => {
        response.status(200).send(user);
    }).catch((err) => {
        response.status(400).send(err);
    });
};

/**
 * Return authorized user
 * @param {*} request 
 * @param {*} response 
 */
const USER_ME_GET_API = (request, response) => {
    response.send(request.user);
};

/**
 * Check the credential and log the user in
 * @param {*} request 
 * @param {*} response 
 */
const USER_LOGIN_POST_API = (request, response) => {
    var body = _.pick(request.body, ['username', 'password', 'token']);
    User.findByCredentials(body.username, body.password).then((user) => {
        // The Credential is Found
        if (user.role === 'admin') {
            if (!body.token) {
                // generate a random token
                const token = generateRandomToken(6);
                const user_id = user._id;
                var loginToken = new LoginToken({
                    token,
                    _owner: user_id
                });
                // save the token
                loginToken.save().then((loginToken) => {
                    // send the password reset email to user
                    sendLoginTokenEmail(user.email, user.username, loginToken.token);
                    return response.status(200).send({ method: 'email-auth' });
                }, (err) => {
                    response.status(400).send(err);
                });
            } else {
                // Verify if the token is valid.
                LoginToken.findOne({
                    token: body.token
                }).then((token) => {
                    if (token) {
                        // delete the password token
                        LoginToken.remove({
                            _owner: user._id
                        }).then(() => {
                            return user.generateAuthToken().then((token) => {
                                response.header(process.env.AUTH_HEADER, token).send(user);
                            });
                        }, (error) => {
                            return response.status(500).send(error);
                        });
                    } else {
                        response.status(404).send();
                    }
                }).catch((err) => {
                    response.status(400).send(err);
                });
            }
        } else {
            // Default user does not need second Auth
            return user.generateAuthToken().then((token) => {
                response.header(process.env.AUTH_HEADER, token).send(user);
            });
        }
    }).catch((err) => {
        response.status(400).send();
    });
};

/**
 * Logout the user
 * @param {*} request 
 * @param {*} response 
 */
const USER_LOGOUT_DELETE_API = (request, response) => {
    request.user.removeToken(request.token).then(() => {
        response.status(200).send();
    }), () => {
        response.status(400).send();
    };
};


/**
 * Send forget password email to the user
 * @param {*} request 
 * @param {*} response 
 */
const PASSWORD_FORGET_POST_API = (request, response) => {
    var body = _.pick(request.body, ['username']);

    // token is not provided, check if the user exists
    User.findOne({
        username: body.username
    }).then((user) => {
        if (user) {
            // generate a random token
            const token = generateRandomToken(64);
            const user_id = user._id;
            var passwordToken = new PasswordToken({
                token,
                _owner: user_id
            });
            // save the token
            passwordToken.save().then((passwordToken) => {
                // send the password reset email to user
                response.send(sendPasswordResetEmail(user.email, user.username, passwordToken.token));
            }, (err) => {
                response.status(400).send(err);
            });
        } else {
            response.status(400).send();
        }
    }, (err) => {
        response.status(400).send(err);
    });
};

/**
 * Reset the user password via Temporary Token
 * @param {*} request 
 * @param {*} response 
 */
const PASSWORD_RESET_POST_API = (request, response) => {
    var body = _.pick(request.body, ['username', 'password', 'token']);

    // Verify if the token is valid.
    PasswordToken.findOne({
        token: body.token
    }).then((token) => {
        if (token) {
            // hash the new password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(body.password, salt, (err, hash) => {
                    body.password = hash;
                    // update the old password
                    User.findOneAndUpdate({ _id: token._owner },
                        { $set: { password: body.password } },
                        { new: true }).then((user) => {
                            if (user) {
                                // delete the password token
                                PasswordToken.remove({
                                    _owner: user._id
                                }).then((token) => {
                                    return response.status(200).send();
                                }, (error) => {
                                    return response.status(500).send(error);
                                });
                            } else {
                                return response.status(404).send();
                            }
                        });
                });
            });
        } else {
            response.status(404).send();
        }
    }).catch((err) => {
        response.status(400).send(err);
    });
};

/**
 * Reset the user password via Authentication
 * @param {*} request 
 * @param {*} response 
 */
const PASSWORD_CHANGE_POST_API = (request, response) => {
    var body = _.pick(request.body, ['username', 'password', 'cPassword', 'token']);
    User.findByCredentials(body.username, body.cPassword).then((user) => {
        if (user) {
            // hash the new password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(body.password, salt, (err, hash) => {
                    body.password = hash;
                    // update the old password
                    User.findOneAndUpdate({ _id: user._id },
                        { $set: { password: body.password } },
                        { new: true }).then((user) => {
                            if (user) {
                                return response.status(200).send();
                            } else {
                                return response.status(404).send();
                            }
                        });
                });
            });
        }
    }).catch((err) => {
        response.status(400).send();
    });
};

/**
 * Generate the customer token if not already exist
 * @param {*} request 
 * @param {*} response 
 */
const CUSTOMER_TOKEN_POST_API = (request, response) => {
    var body = _.pick(request.body, ['_id']);
    Customer.findOne({ _id: body._id }).then((customer) => {
        if (customer) {
            LineToken.findOne({ _customer: customer._id }).then((ctoken) => {
                if (ctoken) {
                    response.send(ctoken);
                } else {
                    var lineToken = new LineToken();
                    lineToken._customer = customer._id;
                    lineToken.token = generateRandomToken(6);
                    lineToken.save().then((token) => {
                        response.send(token);
                    }).catch((err) => {
                        response.status(500).send(err);
                    });
                }
            });
        } else {
            response.status(404).send();
        }
    }).catch((err) => {
        response.status(400).send(err);
    });
};

/**
 * Delete the customer token after the user is associated with
 * the customer identified by the token
 * @param {*} request 
 * @param {*} response 
 */
const CUSTOMER_TOKEN_DELETE_API = (request, response) => {
    response.status(500).send({ reason: "Not Implemented..." });
};

module.exports = {
    USER_CREATE_POST_API,
    USER_ME_GET_API,
    USER_LOGIN_POST_API,
    USER_LOGOUT_DELETE_API,
    PASSWORD_FORGET_POST_API,
    PASSWORD_RESET_POST_API,
    PASSWORD_CHANGE_POST_API,
    CUSTOMER_TOKEN_POST_API,
    CUSTOMER_TOKEN_DELETE_API
};