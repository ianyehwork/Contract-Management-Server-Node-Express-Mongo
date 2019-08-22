// Controller import
const { PAYMENT_POST_API, PAYMENT_GET_API, PAYMENT_GET_ID_API, PAYMENT_DELETE_API, PAYMENT_PATCH_API, PAYMENT_SUMMARY_GET_API} = require('../controllers/payment-api');
// Middleware import
const AdminAuthenticateMiddleware = require('../middleware/authenticate-admin');
const PaymentContractActiveMiddleware = require('../middleware/payment-contract-active');
const AuthenticateMiddleware = require('../middleware/authenticate');

module.exports = (app) => {
    // Customer Routes Definition
    app.post('/payments', AdminAuthenticateMiddleware, PaymentContractActiveMiddleware, PAYMENT_POST_API);
    app.get('/payments', AdminAuthenticateMiddleware, PAYMENT_GET_API);
    app.get('/payments/summary', AdminAuthenticateMiddleware, PAYMENT_SUMMARY_GET_API);
    app.get('/payments/:id', AuthenticateMiddleware, PAYMENT_GET_ID_API);
    app.delete('/payments/:id', AdminAuthenticateMiddleware, PaymentContractActiveMiddleware, PAYMENT_DELETE_API);
    app.patch('/payments/:id', AdminAuthenticateMiddleware, PaymentContractActiveMiddleware, PAYMENT_PATCH_API);

}