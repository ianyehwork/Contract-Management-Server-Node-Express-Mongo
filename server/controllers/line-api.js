const _ = require('lodash');
const { isSignatureValid, processLineMessage } = require('../line/line-controller');

const WEBHOOK_POST_API = (request, response) => {
    // console.log('request.headers');
    // console.log(request.headers);
    // console.log('request.body');
    // console.log(request.body);
    if (isSignatureValid(request.headers['x-line-signature'], request.body)) {
        // Process the incoming messages
        _.forEach(request.body['events'], function (value) {
            var data = {};
            data['replyToken'] = value['replyToken'];
            data['type'] = value['type'];
            data['sourceType'] = value['source']['type'];
            data['sourceUserId'] = value['source']['userId'];
            data['messageType'] = value['message']['type'];
            data['messageText'] = value['message']['text'];
            processLineMessage(data);
        });

    } else {
        console.log('Invalid Signature!');
    }
    return response.send();
};

module.exports = {
    WEBHOOK_POST_API
};