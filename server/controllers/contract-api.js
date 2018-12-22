/**
 * This file represents the REST API for Contract collection.
 */
const _ = require('lodash');
const { ObjectID } = require('mongodb');
var { Contract } = require('./../models/contract');
var { ParkingLot } = require('./../models/parking-lot');
const { generateLocalDateTime } = require('./../util/utility');
const url = require('url');
const Transaction = require('mongoose-transactions');
var { Customer } = require('./../models/customer');

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
        if (result) {
            result.status = false;
            body.pYear = body.sYear;
            body.pMonth = body.sMonth;
            body.pDay = body.sDay;
            var model = new Contract(body);
            model.dateCreated = generateLocalDateTime();
            model.dateModified = generateLocalDateTime();

            const transaction = new Transaction();
            try {
                transaction.update('ParkingLot', result._id, result, { new: true });
                transaction.insert('Contract', model);
                transaction.run().then((result) => {
                    doc = result[1];
                    Contract.findOne({ _id: doc._id }).populate({
                        path: '_customer',
                        select: 'pContact pPhone vehicles'
                    }).populate({
                        path: '_lot',
                        select: 'identifier deposit rent'
                    }).then((model) => {
                        var vehicles = [];
                        _.forEach(model.vehicles, function (value) {
                            vehicles.push({ vin: _.toString(value.vin) });
                        });
                        model.vehicles = vehicles;
                        return response.send(model);
                    }).catch((err) => {
                        response.status(400).send();
                    });
                }).catch(err => {
                    console.error(err);
                    transaction.rollback().catch(console.error);
                    response.status(500).send();
                });
            } catch (err) {
                console.error(err);
                transaction.rollback().catch(console.error);
                response.status(500).send();
            }

        }
    })
};

const CONTRACT_GET_API = (request, response) => {
    var queryData = url.parse(request.url, true).query;
    queryData.page = _.toInteger(queryData.page);
    queryData.pageSize = _.toInteger(queryData.pageSize);
    
    // Filter
    var filter = {};
    if (queryData.field && queryData.match) {
        filter[queryData.field] = queryData.match;
    }
    if (queryData.active) {
        filter.active = queryData.active;
    }

    // Sort
    var sortObj = {};
    if (queryData.order === 'pDate') {
        sortObj = {
            pYear: queryData.reverse,
            pMonth: queryData.reverse,
            pDay: queryData.reverse
        };
    } else if (queryData.order === 'sDate') {
        sortObj = {
            sYear: queryData.reverse,
            sMonth: queryData.reverse,
            sDay: queryData.reverse
        };
    } else {
        sortObj = { [queryData.order]: queryData.reverse }
    }

    var customerFilter = queryData.contactName === undefined ? '' : queryData.contactName;
    var customerQuery = Customer.find({ pContact: { $regex: "^" + customerFilter } }, "_id");
    var parkingLotFilter = queryData.parkingLot === undefined ? '' : queryData.parkingLot;
    var parkingLotQuery = ParkingLot.find({ identifier: { $regex: "^" + parkingLotFilter } }, "_id");
    Promise.all([customerQuery, parkingLotQuery])
        .then((results) => {
            var customer_ids = [];
            results[0].forEach((value) => {
                customer_ids.push(value._id);
            });
            var parkinglot_ids = [];
            results[1].forEach((value) => {
                parkinglot_ids.push(value._id);
            });

            // Convert String to Object Property using []
            filter['_customer'] = {$in: customer_ids};
            filter['_lot'] = {$in: parkinglot_ids};
            const query = Contract.find(filter)
                .sort(sortObj)
                .skip((queryData.page - 1) * queryData.pageSize)
                .limit(queryData.pageSize)
                .populate({
                    path: '_customer',
                    select: 'pContact pPhone vehicles'
                }).populate({
                    path: '_lot',
                    select: 'identifier deposit rent'
                });

            Promise.all([query, Contract.find(filter).countDocuments()])
                .then((results) => {
                    response.send({
                        data: results[0],
                        collectionSize: results[1]
                    });
                }).catch((err) => {
                    console.log(err);
                    response.status(500).send();
                });
        }).catch((err) => {
            console.log(err);
            response.status(500).send();
        });
};

const CONTRACT_GET_ID_API = (request, response) => {
    var id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Contract.findOne({ _id: id, }).populate({
        path: '_customer',
        select: 'pContact pPhone vehicles'
    }).populate({
        path: '_lot',
        select: 'identifier deposit rent'
    }).then((model) => {
        if (!model) {
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

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Contract.findOneAndUpdate({ _id: id }, { $set: body }, { new: true }).populate({
        path: '_customer',
        select: 'pContact pPhone vehicles'
    }).populate({
        path: '_lot',
        select: 'identifier deposit rent'
    }).then((model) => {
        if (!model) {
            return response.status(404).send();
        }
        if (!model.active) {
            ParkingLot.findOneAndUpdate({ _id: model._lot._id }, { $set: { status: true } }).then(() => { });
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