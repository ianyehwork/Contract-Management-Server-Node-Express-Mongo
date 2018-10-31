/**
 * This file represents the REST API for Customer collection.
 */
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {Customer} = require('./../models/customer');
const {generateLocalDateTime} = require('./../util/utility');
const url = require('url');

const CUSTOMER_POST_API = (request, response) => {
    var body = _.pick(request.body, [
        'pContact', 
        'sContact', 
        'pPhone',
        'sPhone',
        'address'
    ]);
    var model = new Customer(body);
    _.forEach(request.body.vehicles, function(value) {
        model.vehicles.push({vin: _.toString(value)});
    });
    model.dateCreated = generateLocalDateTime();
    model.dateModified = generateLocalDateTime();
    model.save().then((doc) => {
        response.send(doc);
    }, (err) => {
        response.status(400).send(err);
    });
};

const CUSTOMER_GET_API = (request, response) => {
    var queryData = url.parse(request.url, true).query;
    var filter = {};
    if(queryData.startWith) {
        filter.pContact = {$regex : "^" + queryData.startWith};
    }
    Customer.find(filter).then((model) => {
        response.send(model); 
    }, (err) => {
        response.status(400).send(err);
    });
};

const CUSTOMER_GET_ID_API = (request, response) => {
    var id = request.params.id;
    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    Customer.findOne({
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

const CUSTOMER_DELETE_API = (request, response) => {
    var id = request.params.id;
    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    Customer.findOneAndRemove({
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

const CUSTOMER_PATCH_API = (request, response) => {
    var id = request.params.id;
    // Only extract the properties required if exist
    var body = _.pick(request.body, [
        'pContact', 
        'sContact', 
        'pPhone',
        'sPhone',
        'address'
    ]);

    body.vehicles = [];
    _.forEach(request.body.vehicles, function(value) {
        body.vehicles.push({vin: _.toString(value)});
    });
    body.dateModified = generateLocalDateTime();

    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    Customer.findOneAndUpdate({ _id: id}, 
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
    CUSTOMER_POST_API,
    CUSTOMER_GET_API,
    CUSTOMER_GET_ID_API,
    CUSTOMER_DELETE_API,
    CUSTOMER_PATCH_API
};