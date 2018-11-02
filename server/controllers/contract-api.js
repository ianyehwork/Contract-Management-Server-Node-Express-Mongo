/**
 * This file represents the REST API for Contract collection.
 */
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {Contract} = require('./../models/contract');
var {ParkingLot} = require('./../models/parking-lot');
const {generateLocalDateTime} = require('./../util/utility');
const url = require('url');

const CONTRACT_POST_API = (request, response) => {
    var body = _.pick(request.body, [
        '_customer',
        '_lot',
        'sYear',
        'sMonth',
        'sDay',
        'pFrequency',
        'comment'
    ]);

    ParkingLot.findOne({
        _id: body._lot,
        status: true
    }).then((result) => {
        if(result) {
            result.status = false;
            result.save();
        }
    })

    body.pYear = body.sYear;
    body.pMonth = body.sMonth;
    body.pDay = body.sDay;
    var model = new Contract(body);
    model.dateCreated = generateLocalDateTime();
    model.dateModified = generateLocalDateTime();
    model.save().then((doc) => {
        Contract.findOne({ _id: doc._id}).populate({
            path: '_customer',
            select: 'pContact pPhone vehicles'
        }).populate({
            path: '_lot',
            select: 'identifier deposit rent'
        }).then((model) => {
            var vehicles = [];
            _.forEach(model.vehicles, function(value) {
                vehicles.push({vin: _.toString(value.vin)});
            });
            model.vehicles = vehicles;
            return response.send(model);
        }).catch((err) => {
            response.status(400).send();
        });
        
    }, (err) => {
        response.status(400).send(err);
    });
};

const CONTRACT_GET_API = (request, response) => {
    var queryData = url.parse(request.url, true).query;
    var filter = {};
    if(queryData.active) {
        filter.active = queryData.active;
    }
    Contract.find(filter).populate({
        path: '_customer',
        select: 'pContact pPhone vehicles'
    }).populate({
        path: '_lot',
        select: 'identifier deposit rent'
    }).then((model) => {
        response.send(model); 
    }, (err) => {
        response.status(400).send(err);
    });
};

const CONTRACT_GET_ID_API = (request, response) => {
    var id = request.params.id;
    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    Contract.findOne({ _id: id,}).populate({
        path: '_customer',
        select: 'pContact pPhone vehicles'
    }).populate({
        path: '_lot',
        select: 'identifier deposit rent'
    }).then((model) => {
        if(!model) {
            return response.status(404).send();
        }
        return response.send(model);
    }).catch((err) => {
        response.status(400).send();
    });
};

// Contract Cannot be DELETE after creation
const CONTRACT_DELETE_API = (request, response) => {
    response.status(405).send();
};

const CONTRACT_PATCH_API = (request, response) => {
    var id = request.params.id;
    // Only extract the properties required if exist
    var body = _.pick(request.body, [
        'active',
        'comment'
    ]);
    body.dateModified = generateLocalDateTime();

    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    Contract.findOneAndUpdate({ _id: id}, {$set: body}, {new: true}).populate({
        path: '_customer',
        select: 'pContact pPhone vehicles'
    }).populate({
        path: '_lot',
        select: 'identifier deposit rent'
    }).then((model) => {
        if(!model) {
            return response.status(404).send();
        }
        if(!model.active) {
            ParkingLot.findOneAndUpdate({_id: model._lot._id}, {$set: {status: true}}).then(() => {});
        }
        return response.send(model);
    }).catch((err) => {
        response.status(400).send();
    });
};

module.exports = {
    CONTRACT_POST_API,
    CONTRACT_GET_API,
    CONTRACT_GET_ID_API,
    CONTRACT_DELETE_API,
    CONTRACT_PATCH_API
};