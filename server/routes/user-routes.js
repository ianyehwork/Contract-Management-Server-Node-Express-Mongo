// Controller import
const { USER_CREATE_POST_API, USER_ME_GET_API, USER_LOGIN_POST_API, USER_LOGOUT_DELETE_API, PASSWORD_RESET_POST_API, CUSTOMER_TOKEN_POST_API,
    CUSTOMER_TOKEN_DELETE_API} = require('../controllers/user-api');

// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');
const AdminAuthenticateMiddleware = require('../middleware/authenticate-admin');

module.exports = (app) => {
    // User Routes Definition
    app.post('/users', USER_CREATE_POST_API);
    app.get('/users/me', AuthenticateMiddleware, USER_ME_GET_API);
    app.post('/users/login', USER_LOGIN_POST_API);
    app.delete('/users/me/token', AuthenticateMiddleware, USER_LOGOUT_DELETE_API);
    app.post('/users/password/reset', AuthenticateMiddleware, PASSWORD_RESET_POST_API);
    app.post('/users/customers/token', AdminAuthenticateMiddleware, CUSTOMER_TOKEN_POST_API);
    app.delete('/users/customers/token', AdminAuthenticateMiddleware, CUSTOMER_TOKEN_DELETE_API);
}