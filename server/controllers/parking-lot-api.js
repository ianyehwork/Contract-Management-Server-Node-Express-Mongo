/**
 * This file represents the REST API for Parking Lot collection.
 */
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {ParkingLot} = require('./../models/parking-lot');
const {generateLocalDateTime} = require('./../util/utility');
const url = require('url');

const PARKING_LOT_POST_API = (request, response) => {
    var body = _.pick(request.body, [
        'identifier', 
        'deposit', 
        'rent',
        'comment',
        '_area'
    ]);
    var model = new ParkingLot(body);
    model.dateCreated = generateLocalDateTime();
    model.dateModified = generateLocalDateTime();
    model.save().then((doc) => {
        response.send(doc);
    }, (err) => {
        response.status(400).send(err);
    });
};

const PARKING_LOT_GET_API = (request, response) => {
    var queryData = url.parse(request.url, true).query;
    queryData.page = _.toInteger(queryData.page);
    queryData.pageSize = _.toInteger(queryData.pageSize);

    var filter = {};
    if (queryData.field && queryData.match) {
        filter[queryData.field] = { $regex: "^" + queryData.match };
    }
    if(queryData._area) {
        filter._area = queryData._area;
    }
    if(queryData.status) {
        filter.status = queryData.status;
    }
    // Convert String to Object Property using []
    const query = ParkingLot.find(filter)
        .sort({ [queryData.order]: (queryData.reverse ? -1 : 1 )})
        .skip((queryData.page - 1) * queryData.pageSize)
        .limit(queryData.pageSize);

    Promise.all([query, ParkingLot.find(filter).countDocuments()])
        .then((results) => {
            response.send({
                data: results[0],
                collectionSize: results[1]
            });
        }).catch((err) => {
            console.log(err);
            response.status(500).send();
        });
};

const PARKING_LOT_GET_ID_API = (request, response) => {
    var id = request.params.id;
    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    ParkingLot.findOne({
        _id: id,
    }).then((model) => {
        if(!model) {
            return response.status(404).send();
        }
        return response.send(model);
    }).catch((err) => {
        response.status(400).send();
    });
};

const PARKING_LOT_DELETE_API = (request, response) => {
    var id = request.params.id;
    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    ParkingLot.findOneAndRemove({
        _id: id
    }).then((model) => {
        if(!model) {
            return response.status(404).send();
        }
        return response.send(model);
    }).catch((err) => {
        response.status(400).send();
    });
};

const PARKING_LOT_PATCH_API = (request, response) => {
    var id = request.params.id;
    // Only extract the properties required if exist
    var body = _.pick(request.body, [
        'identifier', 
        'deposit', 
        'rent',
        'comment'
    ]);

    body.dateModified = generateLocalDateTime();

    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    ParkingLot.findOneAndUpdate({ _id: id}, 
                          {$set: body}, 
                          {new: true}).then((model) => {
        if(!model) {
            return response.status(404).send();
        }
        return response.send(model);
    }).catch((err) => {
        response.status(400).send();
    });
};

module.exports = {
    PARKING_LOT_POST_API,
    PARKING_LOT_GET_API,
    PARKING_LOT_GET_ID_API,
    PARKING_LOT_DELETE_API,
    PARKING_LOT_PATCH_API
};