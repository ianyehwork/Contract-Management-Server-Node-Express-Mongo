/**
 * This file represents the REST API for Parking Area collection.
 */
const _ = require('lodash');
const { ObjectID } = require('mongodb');
var { ParkingArea } = require('./../models/parking-area');
const { generateLocalDateTime } = require('./../util/utility');
const url = require('url');

const PARKING_AREA_POST_API = (request, response) => {
    var body = _.pick(request.body, [
        'identifier',
        'address',
        'defaultDeposit',
        'defaultRent',
        'comment'
    ]);
    var model = new ParkingArea(body);
    _.forEach(request.body.vehicles, function (value) {
        model.vehicles.push({ vin: _.toString(value) });
    });
    model.dateCreated = generateLocalDateTime();
    model.dateModified = generateLocalDateTime();
    model.save().then((doc) => {
        response.send(doc);
    }, (err) => {
        response.status(400).send(err);
    });
};

const PARKING_AREA_GET_API = (request, response) => {
    var queryData = url.parse(request.url, true).query;
    var filter = {};
    var query;
    if(queryData.page) {
        queryData.page = _.toInteger(queryData.page);
        queryData.pageSize = _.toInteger(queryData.pageSize);
        
        if (queryData.field && queryData.match) {
            filter[queryData.field] = { $regex: "^" + queryData.match };
        }
        // Convert String to Object Property using []
        query = ParkingArea.find(filter)
        .sort({ [queryData.order]: queryData.reverse })
        .skip((queryData.page - 1) * queryData.pageSize)
        .limit(queryData.pageSize);
    } else {
        query = ParkingArea.find(filter);
    }

    Promise.all([query, ParkingArea.find(filter).countDocuments()])
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

const PARKING_AREA_GET_ID_API = (request, response) => {
    var id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    ParkingArea.findOne({
        _id: id,
    }).then((model) => {
        if (!model) {
            return response.status(404).send();
        }
        return response.send(model);
    }).catch((err) => {
        response.status(400).send();
    });
};

const PARKING_AREA_DELETE_API = (request, response) => {
    var id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    ParkingArea.findOneAndRemove({
        _id: id
    }).then((model) => {
        if (!model) {
            return response.status(404).send();
        }
        return response.send(model);
    }).catch((err) => {
        response.status(400).send();
    });
};

const PARKING_AREA_PATCH_API = (request, response) => {
    var id = request.params.id;
    // Only extract the properties required if exist
    var body = _.pick(request.body, [
        'identifier',
        'address',
        'defaultDeposit',
        'defaultRent',
        'comment'
    ]);

    body.vehicles = [];
    _.forEach(request.body.vehicles, function (value) {
        body.vehicles.push({ vin: _.toString(value) });
    });
    body.dateModified = generateLocalDateTime();

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    ParkingArea.findOneAndUpdate({ _id: id },
        { $set: body },
        { new: true }).then((model) => {
            if (!model) {
                return response.status(404).send();
            }
            return response.send(model);
        }).catch((err) => {
            response.status(400).send();
        });
};

module.exports = {
    PARKING_AREA_POST_API,
    PARKING_AREA_GET_API,
    PARKING_AREA_GET_ID_API,
    PARKING_AREA_DELETE_API,
    PARKING_AREA_PATCH_API
};