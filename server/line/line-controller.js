const crypto = require('crypto');
const _ = require('lodash');
const line = require('@line/bot-sdk');
const { Customer } = require('./../models/customer');
const { Contract } = require('./../models/contract');
const { LineToken } = require('./../models/line-token');

const client = new line.Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

const PLEASE_EMOJI = '\u{10007A}';
const HAPPY_EMOJI = '\u{100090}';
const IDENTITY_NOT_VERIFIED = '身份未驗證! 請輸入身份驗證碼(6位), 並用*結尾.' + PLEASE_EMOJI +' 例如: A82JuL*';
const IDENTITY_VERIFIED = '身份已驗證! 您的身份是: ';
const SYSTEM_ERROR = '系統錯誤! 請通知管理員, 謝謝!';
const CUSTOMER_TOKEN_NOT_EXISTS = '驗證碼不存在! 請輸入身份驗證碼(6位), 並用*結尾. 例如: A82JuL*';
const MENU_INSTRUCTION = '指令清單:\n新用戶身分驗證請輸入 *1\n合同/付款查詢請輸入 *2'

/**
 * The signature in the X-Line-Signature request header must be
 * verified to confirm that the request was sent from the LINE Platform.
 * @param {*} signature X-Line-Signature request header
 * @param {*} body request.body
 */
const isSignatureValid = (headerSignature, requestBody) => {
    const channelSecret = process.env.LINE_CHANNEL_SECRET; // Channel secret string
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
    if(process.env.LINE_TEST_MODE) {
        console.log('Process Message...');
        console.log(data);
    }
    if (data['type'] === 'message' &&
        data['sourceType'] === 'user' &&
        data['messageType'] === 'text') {
        const replyTokenValue = data['replyToken'];
        if (data['messageText'] === '*1') {
            // Identity Verification
            Customer.findOne({ lineUID: data['sourceUserId'] }).then((customer) => {
                if (customer) {
                    sendMessage(replyTokenValue, IDENTITY_VERIFIED + customer.pContact + '.' + HAPPY_EMOJI);
                } else {
                    sendMessage(replyTokenValue, IDENTITY_NOT_VERIFIED);
                }
            }).catch((err) => {
                sendMessage(replyTokenValue, SYSTEM_ERROR);
            });
        } else if(data['messageText'] === '*2') {
            // Contract Inquiry
            Customer.findOne({ lineUID: data['sourceUserId'] }).then((customer) => {
                if (!customer) {
                    sendMessage(replyTokenValue, IDENTITY_NOT_VERIFIED);
                } else {
                    Contract.find({_customer: customer._id}).then((contract) => {
                        sendMessage(replyTokenValue, contract);
                    });

                    
                }
            }).catch((err) => {
                sendMessage(replyTokenValue, SYSTEM_ERROR);
            });
        } else if (_.toString(data['messageText']).match(/^[0-9a-zA-z]{6}\*/).length > 0) {
            // Indentity Verification
            Customer.findOne({ lineUID: data['sourceUserId'] }).then((customer) => {
                if (customer) {
                    sendMessage(replyTokenValue, IDENTITY_VERIFIED + customer.pContact + '.' + HAPPY_EMOJI);
                } else {
                    LineToken.findOne({ token: _.toString(data['messageText']).substr(0, 6) }).then((token) => {
                        if (token) {
                            Customer.findOne({ _id: token._customer }).then((customer) => {
                                if (customer) {
                                    sendMessage(replyTokenValue, IDENTITY_VERIFIED + customer.pContact + '.');
                                    customer.lineUID = data['sourceUserId'];
                                    customer.save();
                                    LineToken.deleteOne({ token: _.toString(data['messageText']).substr(0, 6) }).then((token) => { }).catch((err) => { });
                                } else {
                                    sendMessage(replyTokenValue, CUSTOMER_TOKEN_NOT_EXISTS);
                                }
                            }).catch((err) => {
                                sendMessage(replyTokenValue, SYSTEM_ERROR);
                            });
                        } else {
                            sendMessage(replyTokenValue, CUSTOMER_TOKEN_NOT_EXISTS);
                        }
                    }).catch((err) => {
                        sendMessage(replyTokenValue, SYSTEM_ERROR);
                    });
                }
            }).catch((err) => {
                sendMessage(replyTokenValue, SYSTEM_ERROR);
            });
        } else {
            // Show the menu if the command is invalid
            sendMessage(replyTokenValue, MENU_INSTRUCTION);
        }
    } else {
        sendMessage(replyTokenValue, MENU_INSTRUCTION);
    }
}

const sendMessage = (replyToken, message) => {
    client.replyMessage(replyToken, {
        type: 'text',
        text: message
    }).then(() => {
        // Log the message?
        if(process.env.LINE_TEST_MODE) {
            console.log('Line Message Sent!');
        }
    }).catch((err) => {
        // error handling
        console.log(err);
    });

}

module.exports = {
    isSignatureValid,
    processLineMessage
};