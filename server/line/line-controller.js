const crypto = require('crypto');
const _ = require('lodash');
const line = require('@line/bot-sdk');
var { Customer } = require('./../models/customer');

const client = new line.Client({
    channelAccessToken: 'EfqyA+FjGoRyGTEOB0eNHaJH5fCXZzrC6JsU0KO4jVrhqD3P5ssShCKafU2Msbjf6JmyIJif1PZzgvSNP8dWm8dqOVT6J/adoT+If/I1DWqUHU+UTQ9bH1PDfyi4ZIEIHrs36ATXd00L0DOXf4WJmwdB04t89/1O/w1cDnyilFU='
});

/**
 * The signature in the X-Line-Signature request header must be
 * verified to confirm that the request was sent from the LINE Platform.
 * @param {*} signature X-Line-Signature request header
 * @param {*} body request.body
 */
const isSignatureValid = (headerSignature, requestBody) => {
    const channelSecret = 'c06ce72aa9ba05542fa8a171b779a869'; // Channel secret string
    const body = JSON.stringify(requestBody); // Request body string
    console.log(body);
    const signature = crypto
        .createHmac('SHA256', channelSecret)
        .update(body).digest('base64');
    // Compare X-Line-Signature request header and the signature
    return headerSignature === signature;
}

/**
 * @param {*} data - replyToken, type, sourceType, sourceUserId, messageType, messageText
 */
const processLineMessage = (data) => {
    if (data['type'] === 'message' &&
        data['sourceType'] === 'user' &&
        data['messageType'] === 'text') {
        if(data['messageText'] === '*1') {
            Customer.find({lineUID: data['sourceUserId']}).then((user) => {
                if(user) {
                    sendMessage(data['replyToken'], '身份已驗證! 您的身份是: ' + user.pContact + '.');
                } else {
                    console.log('Here AAA!');
                    sendMessage(data['replyToken'], '身份未驗證! 請輸入身份驗證碼(6位), 並用*結尾.\n例如: A82JuL*');
                }
            }).catch((err) => {
                console.log('Here BBB!');
                sendMessage(data['replyToken'], '身份未驗證! 請輸入身份驗證碼(6位), 並用*結尾.\n例如: A82JuL*');
            });
        } else if(data['messageText'] === '*2') {
            
        }
        // console.log(data['sourceUserId'] + ":" + data['messageText']);
        // sendMessage(data['replyToken'], message);
    } else {
        sendMessage(data['replyToken'], '指令無法識別!');
    }
}

const sendMessage = (replyToken, message) => {
    client.replyMessage(replyToken, {
        type: 'text',
        text: message
    }).then(() => {
        // Log the message?
        console.log('Success!');
    }).catch((err) => {
        // error handling
        console.log(err);
    });

}

module.exports = {
    isSignatureValid,
    processLineMessage
};