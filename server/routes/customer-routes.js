// Controller import
const { CUSTOMER_POST_API, CUSTOMER_GET_API, CUSTOMER_GET_ID_API, CUSTOMER_DELETE_API, CUSTOMER_PATCH_API} = require('../controllers/customer-api');
// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');
const CustomerDeleteMiddleware = require('../middleware/customer-delete');
const AdminAuthenticateMiddleware = require('../middleware/authenticate-admin');

module.exports = (app) => {
    // Customer Routes Definition
    app.post('/customers', AdminAuthenticateMiddleware, CUSTOMER_POST_API);
    app.get('/customers', AdminAuthenticateMiddleware, CUSTOMER_GET_API);
    app.get('/customers/:id', AuthenticateMiddleware, CUSTOMER_GET_ID_API);
    app.delete('/customers/:id', AdminAuthenticateMiddleware, CustomerDeleteMiddleware, CUSTOMER_DELETE_API);
    app.patch('/customers/:id', AuthenticateMiddleware, CUSTOMER_PATCH_API);
}