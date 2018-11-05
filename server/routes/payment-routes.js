// Controller import
const { PAYMENT_POST_API, PAYMENT_GET_API, PAYMENT_GET_ID_API, PAYMENT_DELETE_API, PAYMENT_PATCH_API} = require('../controllers/payment-api');
// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');
const PaymentContractActiveMiddleware = require('../middleware/payment-contract-active');

module.exports = (app) => {
    // Customer Routes Definition
    app.post('/payments', AuthenticateMiddleware, PaymentContractActiveMiddleware, PAYMENT_POST_API);
    app.get('/payments', AuthenticateMiddleware, PAYMENT_GET_API);
    app.get('/payments/:id', AuthenticateMiddleware, PAYMENT_GET_ID_API);
    app.delete('/payments/:id', AuthenticateMiddleware, PaymentContractActiveMiddleware, PAYMENT_DELETE_API);
    app.patch('/payments/:id', AuthenticateMiddleware, PaymentContractActiveMiddleware, PAYMENT_PATCH_API);
}