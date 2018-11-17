const crypto = require('crypto');
const _ = require('lodash');

/**
 * The signature in the X-Line-Signature request header must be
 * verified to confirm that the request was sent from the LINE Platform.
 * @param {*} signature X-Line-Signature request header
 * @param {*} body request.body
 */
const isSignatureValid = (headerSignature, requestBody) => {
    const channelSecret = c06ce72aa9ba05542fa8a171b779a869; // Channel secret string
    const body = JSON.stringify(requestBody); // Request body string
    const signature = crypto
        .createHmac('SHA256', channelSecret)
        .update(body).digest('base64');
    // Compare X-Line-Signature request header and the signature
    return headerSignature === signature;
}

const WEBHOOK_POST_API = (request, response) => {
    console.log('request.headers');
    console.log(request.headers);
    console.log(isSignatureValid(request.headers.x-line-signature) ? 'Valid Signature' : "Invalid Signature")
    console.log('request.body');
    console.log(request.body);
    return response.send();
};

module.exports = {
    WEBHOOK_POST_API
};