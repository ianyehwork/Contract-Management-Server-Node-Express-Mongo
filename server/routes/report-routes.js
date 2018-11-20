// Controller import
const { REPORT_PAYMENT_GET_API, REPORT_INCOME_GET_API } = require('../controllers/report-api');
// Middleware import
const AdminAuthenticateMiddleware = require('../middleware/authenticate-admin');

module.exports = (app) => {
    // Routes Definition
    app.get('/reports/payments', AdminAuthenticateMiddleware, REPORT_PAYMENT_GET_API);
    app.get('/reports/incomes', AdminAuthenticateMiddleware, REPORT_INCOME_GET_API);
}