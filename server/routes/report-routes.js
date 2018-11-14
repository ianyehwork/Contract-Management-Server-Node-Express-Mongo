// Controller import
const { REPORT_PAYMENT_GET_API, REPORT_INCOME_GET_API } = require('../controllers/report-api');
// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');

module.exports = (app) => {
    // Routes Definition
    app.get('/reports/payments', AuthenticateMiddleware, REPORT_PAYMENT_GET_API);
    app.get('/reports/incomes', AuthenticateMiddleware, REPORT_INCOME_GET_API);
}