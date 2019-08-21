const crypto = require('crypto');
const _ = require('lodash');
const line = require('@line/bot-sdk');
const { Customer } = require('./../models/customer');
const { Contract } = require('./../models/contract');
const { Payment } = require('./../models/payment');
const { LineToken } = require('./../models/line-token');

const client = new line.Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

// const PLEASE_EMOJI = '\u{10007A}';
// const HAPPY_EMOJI = '\u{100090}';
const IDENTITY_NOT_VERIFIED = '身份未驗證! 請輸入身份驗證碼(7位).';
const IDENTITY_VERIFIED = '身份已驗證! 您的身份是: ';
const SYSTEM_ERROR = '系統錯誤! 請通知管理員, 謝謝!';
const CUSTOMER_TOKEN_NOT_EXISTS = '驗證碼過期或不存在! 請輸入身份驗證碼(7位).';
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
    if(process.env.LINE_TEST_MODE) {
        console.log(body);
    }
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
                        select: 'rent identifier'
                    }).then((contracts) => {
                        if(!contracts) {
                            sendMessage(replyTokenValue, NO_ACTIVE_CONTRACT);
                        } else {
                            
                            var promises = [];
                            for (i = 0; i < contracts.length; i++) {
                                
                                if(contracts[i]) {
                                    // Promise can be a primitive value / object
                                    var promise1 = contracts[i];
                                    var promise2 = Payment.find({_contract: contracts[i]._id});
                                    promises.push(Promise.all([promise1, promise2]));
                                }
                            }

                            Promise.all(promises).then((values) => {
                                var message = '';
                                for(var j = 0 ; j < values.length; j++) {
                                    var value = values[j];
                                    contract = value[0];
                                    payments = value[1];

                                    message += '起租日期: ' + contract.sYear + '/' + contract.sMonth + '/' + contract.sDay + '\n';
                                    message += '車位: ' + contract._lot.identifier + '\n';
                                    message += '月租金: ' + contract._lot.rent + '\n';
                                    message += '繳費週期: ' + contract.pFrequency + '個月\n';
                                    if(payments) {
                                        message += '繳費紀錄:\n';
                                        for (var k = 0; k < payments.length; k++) {
                                            var payment = '';
                                            if(payments[k].type == 'R' || payments[k].type == 'D') {
                                                var d = payments[k].dateCreated;
                                                var date = d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate();
                                                var type = payments[k].type == 'R' ? '租金' : '押金';
                                                payment +=  date + ' ' + type + ' ' + payments[k].amount + '\n';
                                                message += payment;
                                            }
                                        }
                                    }
                                    message += '下次繳費日期: ' + contract.pYear + '/' + contract.pMonth + '/' + contract.pDay + '\n';
                                    message += '下次繳費金額: ' + (contract.pFrequency * contract._lot.rent) + '\n';
                                }

                                sendMessage(replyTokenValue, message);
                            });
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