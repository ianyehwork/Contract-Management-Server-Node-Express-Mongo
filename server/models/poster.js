/**
 * This file represents the model for Poster collection.
 */
var mongoose = require('mongoose');
const _ = require('lodash');

var PosterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 256
    },
    category: {
        type: String,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    url: {
        type: String,
        default: '',
        required: false
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

PosterSchema.methods.toJSON = function(){
    var poster = this;
    var posterObject = poster.toObject();
    return _.pick(posterObject, [
        '_id',
        'title', 
        'description', 
        'category',
        'startTime',
        'endTime',
        'location',
        'url',
        '_creator'
    ]);
};

var Poster = mongoose.model('Poster', PosterSchema);

module.exports = {
    Poster
};