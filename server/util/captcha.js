const request = require('request');
app.post('/captcha', (request, response) => {
    const captcha = request.body.captcha;
    const remoteAddr = request.connection.remoteAddress;
    if(!captcha) {
        response.status(400).send('Captcha is required.');
    }
    // Secret key
    const secretKey = '6Lc_KVoUAAAAAMkExGWT5TbVAd80SXM0r_9rsloE';

    // Verify URL
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${remoteAddr}`;

    // Make request to verify URL
    request(verifyURL, (error, response, body) => {
        body = JSON.parse(body);
        // If not success
        if(body.success !== undefined && !body.success) {
            response.status(400).send('Failed captcha verification.');
        }
        // If success
        response.status(200).send();
    });
});