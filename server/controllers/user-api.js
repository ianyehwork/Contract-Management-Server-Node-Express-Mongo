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
 * Reset the user password
 * @param {*} request 
 * @param {*} response 
 */
const PASSWORD_RESET_POST_API = (request, response) => {
    var body = _.pick(request.body, ['username', 'password', 'cPassword', 'token']);
    if (body.cPassword) {
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
    } else {
        if (!body.token) {
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
        } else {
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
        }
    }
};

module.exports = {
    USER_CREATE_POST_API,
    USER_ME_GET_API,
    USER_LOGIN_POST_API,
    USER_LOGOUT_DELETE_API,
    PASSWORD_RESET_POST_API
};