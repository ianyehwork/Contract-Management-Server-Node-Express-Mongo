// Controller import
const { REPORT_PAYMENT_GET_API } = require('../controllers/report-api');
// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');

module.exports = (app) => {
    // Customer Routes Definition
    app.get('/reports/payments', AuthenticateMiddleware, REPORT_PAYMENT_GET_API);
}