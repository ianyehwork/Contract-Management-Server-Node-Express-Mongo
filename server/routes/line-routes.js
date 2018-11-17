// Controller import
const { WEBHOOK_POST_API } = require('../controllers/line-api');
module.exports = (app) => {
    app.post('/webhook', WEBHOOK_POST_API);
}