const WEBHOOK_POST_API = (request, response) => {
    console.log('request.headers');
    console.log(request.headers);
    console.log('request.body');
    console.log(request.body);
    return response.send();
};

module.exports = {
    WEBHOOK_POST_API
};