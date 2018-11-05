// Controller import
const { CUSTOMER_POST_API, CUSTOMER_GET_API, CUSTOMER_GET_ID_API, CUSTOMER_DELETE_API, CUSTOMER_PATCH_API} = require('../controllers/customer-api');
// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');
const CustomerDeleteMiddleware = require('../middleware/customer-delete');

module.exports = (app) => {
    // Customer Routes Definition
    app.post('/customers', AuthenticateMiddleware, CUSTOMER_POST_API);
    app.get('/customers', AuthenticateMiddleware, CUSTOMER_GET_API);
    app.get('/customers/:id', AuthenticateMiddleware, CUSTOMER_GET_ID_API);
    app.delete('/customers/:id', AuthenticateMiddleware, CustomerDeleteMiddleware, CUSTOMER_DELETE_API);
    app.patch('/customers/:id', AuthenticateMiddleware, CUSTOMER_PATCH_API);
}