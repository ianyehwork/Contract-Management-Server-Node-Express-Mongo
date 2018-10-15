// Controller import
const { USER_CREATE_POST_API, USER_ME_GET_API, USER_LOGIN_POST_API, USER_LOGOUT_DELETE_API, PASSWORD_RESET_POST_API} = require('../controllers/user-api');

// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');

module.exports = (app) => {
    // User Routes Definition
    app.post('/users', USER_CREATE_POST_API);
    app.get('/users/me', AuthenticateMiddleware, USER_ME_GET_API);
    app.post('/users/login', USER_LOGIN_POST_API);
    app.delete('/users/me/token', AuthenticateMiddleware, USER_LOGOUT_DELETE_API);
    app.post('/users/password/reset', PASSWORD_RESET_POST_API);
}