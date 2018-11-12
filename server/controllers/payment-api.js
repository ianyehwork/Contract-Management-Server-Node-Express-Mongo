/**
 * This file represents the REST API for Parking Lot collection.
 */
const _ = require('lodash');
const { ObjectID } = require('mongodb');
var { Payment } = require('./../models/payment');
var { Contract } = require('./../models/contract');
const { generateLocalDateTime } = require('./../util/utility');
const url = require('url');
const moment = require('moment');
const Transaction = require('mongoose-transactions')

const PAYMENT_POST_API = (request, response) => {
    var body = _.pick(request.body, [
        '_contract',
        'type',
        'amount',
        'comment'
    ]);

    Contract.findOne({ _id: body._contract }).populate({
        path: '_lot',
        select: 'rent'
    }).then(function (doc) {

        var model = new Payment(body);
        model.dateCreated = generateLocalDateTime();
        model.dateModified = generateLocalDateTime();

        if (model.type !== 'D') {
            if (model.type === 'R') {
                doc.pTotal = doc.pTotal + model.amount;
            } else {
                doc.pTotal = doc.pTotal - model.amount;
            }
            var periodPTotal = doc._lot.rent * doc.pFrequency;
            var count = parseInt(doc.pTotal / periodPTotal);
            var date = moment(new Date(doc.sYear, doc.sMonth - 1, doc.sDay));
            date.add(count * doc.pFrequency, 'months');
            doc.pYear = date.year();
            doc.pMonth = date.month() + 1;
            doc.pDay = date.date();
        } 

        const transaction = new Transaction();
        try {
            transaction.insert('Payment', model);
            transaction.update('Contract', doc._id, doc, { new: true });
            transaction.run().then((result) => {
                response.send(result[0]);
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

    }, (err) => {
        response.status(400).send(err);
    });
};

const PAYMENT_GET_API = (request, response) => {

    var queryData = url.parse(request.url, true).query;
    queryData.page = _.toInteger(queryData.page);
    queryData.pageSize = _.toInteger(queryData.pageSize);

    var filter = {};
    if (queryData.field && queryData.match) {
        filter[queryData.field] = { $regex: "^" + queryData.match };
    }
    if (queryData._contract) {
        filter._contract = queryData._contract;
    }
    // Convert String to Object Property using []
    const query = Payment.find(filter)
        .sort({ [queryData.order]: (queryData.reverse ? -1 : 1) })
        .skip((queryData.page - 1) * queryData.pageSize)
        .limit(queryData.pageSize);

    Promise.all([query, Payment.find(filter).countDocuments()])
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

const PAYMENT_GET_ID_API = (request, response) => {
    var id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Payment.findOne({ _id: id }).then((model) => {
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

// Payment Type Cannot be changed
const PAYMENT_PATCH_API = (request, response) => {
    var id = request.params.id;
    // Only extract the properties required if exist
    var body = _.pick(request.body, [
        'amount',
        'comment'
    ]);

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Payment.findOne({ _id: id, _contract: request.body._contract }).then((orig) => {
        if (orig.type == 'D') {
            orig.comment = body.comment;
            orig.amount = body.amount;
            orig.dateModified = generateLocalDateTime();
            orig.save().then((model) => {
                if (!model) {
                    return response.status(404).send();
                }
                return response.send(model);
            });
        } else {
            Contract.findOne({ _id: orig._contract }).populate({
                path: '_lot',
                select: 'rent'
            }).then(function (doc) {
                if(orig.type == 'R') {
                    doc.pTotal = doc.pTotal - orig.amount + body.amount;
                } else {
                    doc.pTotal = doc.pTotal + orig.amount - body.amount;
                }
                var periodPTotal = doc._lot.rent * doc.pFrequency;
                var count = parseInt(doc.pTotal / periodPTotal);
                var date = moment(new Date(doc.sYear, doc.sMonth - 1, doc.sDay));
                date.add(count * doc.pFrequency, 'months');
                doc.pYear = date.year();
                doc.pMonth = date.month() + 1;
                doc.pDay = date.date();

                orig.comment = body.comment;
                orig.amount = body.amount;
                orig.dateModified = generateLocalDateTime();
                
                const transaction = new Transaction();
                try {
                    transaction.update('Payment', orig._id, orig, { new: true });
                    transaction.update('Contract', doc._id, doc, { new: true });
                    transaction.run().then((result) => {
                        response.send(result[0]);
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
            }, (err) => {
                response.status(400).send(err);
            });
        }
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