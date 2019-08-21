const crypto = require('crypto');
const _ = require('lodash');
const line = require('@line/bot-sdk');
const { Customer } = require('./../models/customer');
const { Contract } = require('./../models/contract');
const { ParkingLot } = require('./../models/parking-lot');
const { Payment } = require('./../models/payment');
const { LineToken } = require('./../models/line-token');

const client = new line.Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

// const PLEASE_EMOJI = '\u{10007A}';
// const HAPPY_EMOJI = '\u{100090}';
const IDENTITY_NOT_VERIFIED = '身份未驗證! 請輸入身份驗證碼(6位), 並用*結尾. 例如: A82JuL*';
const IDENTITY_VERIFIED = '身份已驗證! 您的身份是: ';
const SYSTEM_ERROR = '系統錯誤! 請通知管理員, 謝謝!';
const CUSTOMER_TOKEN_NOT_EXISTS = '驗證碼不存在! 請輸入身份驗證碼(6位), 並用*結尾. 例如: A82JuL*';
const MENU_INSTRUCTION = '指令清單:\n新用戶身分驗證請輸入 *1\n合同/付款查詢請輸入 *2'
const NO_ACTIVE_CONTRACT = '找不到生效的合同！'

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
                    sendMessage(replyTokenValue, IDENTITY_VERIFIED + customer.pContact + '.');
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
                    // Find the customer active contract
                    var filter = { _customer: customer._id, active: true };
                    Contract.find(filter).populate({
                        path: '_lot',
                        select: 'rent'
                    }).then((contracts) => {
                        if(!contracts) {
                            sendMessage(replyTokenValue, NO_ACTIVE_CONTRACT);
                        } else {
                            for (i = 0; i < contracts.length; i++) {
                                function getPayments(callback, contractId){
                                    Payment.find({_contract: contractId}).then((payments) => {
                                        callback(payments);
                                    })
                                }

                                getPayments(function(payments){
                                    var message = '';
                                    message += '起租日期: ' + contracts[i].sYear + '年' + contracts[i].sMonth + '月' + contracts[i].sDay + '日\n';
                                    message += '月租金: ' + contracts[i]._lot.rent + '\n';
                                    message += '繳費週期: ' + contracts[i].pFrequency + '個月\n';
                                    message += '下次繳費日期: ' + contracts[i].pYear + '年' + contracts[i].pMonth + '月' + contracts[i].pDay + '日\n';
                                    message += '下次繳費金額: ' + (contracts[i].pFrequency * contracts[i]._lot.rent) + '\n';
                                    
                                    if(payments) {
                                        message += '繳費紀錄:\n';
                                        for (i = 0; i < payments.length; i++) {
                                            var payment = '';
                                            if(payments[i].type == 'R' || payments[i].type == 'D') {
                                                var type = payments[i].type == 'R' ? '租金' : '押金';
                                                payment += payments[i].dateCreated + ' ' + type + ' ' + payments[i].amount + '\n';
                                                message += payment;
                                            }
                                        }
                                    }
                                    sendMessage(replyTokenValue, message);
                                }, contracts._id);
                            }
                        }
                    });
                }
            }).catch((err) => {
                sendMessage(replyTokenValue, SYSTEM_ERROR);
            });
        } else if (_.toString(data['messageText']).match(/^[0-9a-zA-z]{6}\*/)) {
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