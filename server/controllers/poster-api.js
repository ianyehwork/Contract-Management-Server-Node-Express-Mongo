/**
 * This file represents the REST API for Poster collection.
 */
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {Poster} = require('./../models/poster');

const POSTER_POST_API = (request, response) => {
    var body = _.pick(request.body, [
        'title', 
        'description', 
        'category',
        'startTime',
        'endTime',
        'location',
        'url'
    ]);
    body._creator = request.user._id;
    var poster = new Poster(body);
    poster.save().then((doc) => {
        response.send(doc);
    }, (err) => {
        response.status(400).send(err);
    });
};

const POSTER_GET_API = (request, response) => {
    Poster.find({
        _creator: request.user._id
    }).then((poster) => {
        response.send(poster); 
    }, (err) => {
        response.status(400).send(err);
    });
};

const POSTER_GET_PUBLIC_API = (request, response) => {
    Poster.find().then((poster) => {
        response.send(poster); 
    }, (err) => {
        response.status(400).send(err);
    });
};

const POSTER_GET_ID_API = (request, response) => {
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
        return response.send(poster);
    }).catch((err) => {
        response.status(400).send();
    });
};

const POSTER_DELETE_API = (request, response) => {
    var id = request.params.id;
    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    Poster.findOneAndRemove({
        _id: id,
        _creator: request.user._id
    }).then((poster) => {
        if(!poster) {
            return response.status(404).send();
        }
        return response.send(poster);
    }).catch((err) => {
        response.status(400).send();
    });
};

const POSTER_PATCH_API = (request, response) => {
    var id = request.params.id;
    // Only extract the properties required if exist
    var body = _.pick(request.body, [
        'title', 
        'description', 
        'category',
        'startTime',
        'endTime',
        'location',
        'url'
    ]);

    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    Poster.findOneAndUpdate({ _id: id, _creator: request.user._id}, 
                          {$set: body}, 
                          {new: true}).then((poster) => {
        if(!poster) {
            return response.status(404).send();
        }
        return response.send(poster);
    }).catch((err) => {
        response.status(400).send();
    });
};

module.exports = {
    POSTER_POST_API,
    POSTER_GET_API,
    POSTER_GET_PUBLIC_API,
    POSTER_GET_ID_API,
    POSTER_DELETE_API,
    POSTER_PATCH_API
};