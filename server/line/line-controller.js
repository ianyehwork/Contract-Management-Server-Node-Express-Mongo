const crypto = require('crypto');
const _ = require('lodash');
const line = require('@line/bot-sdk');
const { Customer } = require('./../models/customer');
const { CustomerToken } = require('./../models/customer-token');

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
            Customer.findOne({lineUID: data['sourceUserId']}).then((customer) => {
                if(customer) {
                    sendMessage(data['replyToken'], '身份已驗證! 您的身份是: ' + customer.pContact + '.');
                } else {
                    sendMessage(data['replyToken'], '身份未驗證! 請輸入身份驗證碼(6位), 並用*結尾. 例如: A82JuL*');
                }
            }).catch((err) => {
                sendMessage(data['replyToken'], '系統錯誤! 請通知管理員, 謝謝!');
            });
        } else if(_.toString(data['messageText']).match(/^[0-9a-zA-z]{6}\*/).length > 0) {
            CustomerToken.findOne({token: _.toString(data['messageText']).substr(0, 6)}).then((token) => {
                if(token) {
                    Customer.findOne({_id: token._customer}).then((customer) => {
                        if(customer) {
                            sendMessage(data['replyToken'], '身份已驗證! 您的身份是: ' + customer.pContact + '.');
                            customer.lineUID = data['sourceUserId'];
                            customer.save();
                            CustomerToken.deleteOne({token: _.toString(data['messageText']).substr(0, 6)});
                        } else {
                            sendMessage(data['replyToken'], '驗證碼不存在! 請輸入身份驗證碼(6位), 並用*結尾. 例如: A82JuL*');
                        }
                    }).catch((err) => {
                        sendMessage(data['replyToken'], '系統錯誤! 請通知管理員, 謝謝!');
                    });
                } else {
                    sendMessage(data['replyToken'], '驗證碼不存在! 請輸入身份驗證碼(6位), 並用*結尾. 例如: A82JuL*');
                }
            }).catch((err) => {
                sendMessage(data['replyToken'], '系統錯誤! 請通知管理員, 謝謝!');
            });
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