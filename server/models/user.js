/**
 * User Schema Description:
 * 
 * _id: Internal ID
 * username: username
 * email: email address
 * password: password
 * role: user's priveledge
 * 
 * @author Tsu-Hsin Yeh
 */

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const {UserAuth} = require('./user-auth');
const bcrypt = require('bcryptjs');

const UserSchemaConst = {
    TABLE_NAME : 'User',
    USERNAME: 'username',
    EMAIl: 'email',
    PASSWORD: 'password',
    ROLE: 'role',
    ROLE_VALUES : {
        DEFAULT: 'default',
        ROOT: 'root',
        ADMIN: 'admin',
    }
};

/**
 * User.role must be 'Default', 'Publisher' or 'Admin'
 * @param {*} value 
 */
function role_validator(value) {
    return validator.isIn(value, [
        UserSchemaConst.ROLE_VALUES.DEFAULT, 
        UserSchemaConst.ROLE_VALUES.ROOT, 
        UserSchemaConst.ROLE_VALUES.ADMIN]
    );
}

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            messgae: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 6
    },
    role: {
        type: String,
        default: UserSchemaConst.ROLE_VALUES.DEFAULT,
        validate: {
            isAsync: true,
            validator: role_validator,
            messgae: '{VALUE} is not a valid role'
        }
    }
});

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        // _id: user._id.toHexString(),
        username: user.username,
        role: user.role,
        access,
        exp: Math.floor(Date.now() / 1000) + _.toInteger(process.env.AUTH_TOKEN_TTL_SECOND)
    }, process.env.JWT_SECRET).toString();
    var authToken = new UserAuth({
        access,
        token,
        _owner: user
    });
    authToken.save();
    return user.save().then(() => {
        return token;
    });
        
};

UserSchema.methods.removeToken = function(token) {
    var user = this;
    return UserAuth.remove({
        _owner: new ObjectID(this._id),
        token
    });
};

UserSchema.statics.findByCredentials = function(username, password) {
    var user = this;
    return User.findOne({username}).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result){
                    return resolve(user);
                } else {
                    return reject();
                }
            });
        });
    });
};

/**
 * Before saving the user information. Check if the user's
 * password is changed. If so, properly hashed the password
 * before saved into the database
 */
UserSchema.pre('save', function(next) {
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

/**
 * Before the user is convertored into JSON object,
 * only the _id KVP is selected.
 */
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id']);
};

var User = mongoose.model(UserSchemaConst.TABLE_NAME, UserSchema);

module.exports = {
    User
};