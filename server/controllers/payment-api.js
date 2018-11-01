/**
 * This file represents the REST API for Parking Lot collection.
 */
const _ = require('lodash');
const { ObjectID } = require('mongodb');
var { Payment } = require('./../models/payment');
const { generateLocalDateTime } = require('./../util/utility');
const url = require('url');

const PAYMENT_POST_API = (request, response) => {
    var body = _.pick(request.body, [
        '_contract',
        'type',
        'amount',
        'comment'
    ]);
    var model = new Payment(body);
    model.dateCreated = generateLocalDateTime();
    model.dateModified = generateLocalDateTime();
    model.save().then((doc) => {
        response.send(doc);
    }, (err) => {
        response.status(400).send(err);
    });
};

const PAYMENT_GET_API = (request, response) => {
    var queryData = url.parse(request.url, true).query;
    var filter = {};
    if (queryData._contract) {
        filter._contract = queryData._contract;
    }
    Payment.find(filter).then((model) => {
        response.send(model);
    }, (err) => {
        response.status(400).send(err);
    });
};

const PAYMENT_GET_ID_API = (request, response) => {
    var id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Payment.findOne({
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

// Payment Cannot be DELETE after creation
const PAYMENT_DELETE_API = (request, response) => {
    response.status(405).send();
};

const PAYMENT_PATCH_API = (request, response) => {
    var id = request.params.id;
    // Only extract the properties required if exist
    var body = _.pick(request.body, [
        'type',
        'amount',
        'comment'
    ]);

    body.dateModified = generateLocalDateTime();

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Payment.findOneAndUpdate({ _id: id, _contract: request.body._contract },
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
    PAYMENT_POST_API,
    PAYMENT_GET_API,
    PAYMENT_GET_ID_API,
    PAYMENT_DELETE_API,
    PAYMENT_PATCH_API
};