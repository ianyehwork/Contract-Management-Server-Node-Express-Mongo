// Controller import
const { CONTRACT_POST_API, CONTRACT_GET_API, CONTRACT_GET_ID_API, CONTRACT_DELETE_API, CONTRACT_PATCH_API} = require('../controllers/contract-api');
// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');
const ParkingLotAvailableMiddleware = require('../middleware/parking-lot-available');
const ContractActiveMiddleware = require('../middleware/contract-active');

module.exports = (app) => {
    // Customer Routes Definition
    app.post('/contracts', AuthenticateMiddleware, ParkingLotAvailableMiddleware, CONTRACT_POST_API);
    app.get('/contracts', AuthenticateMiddleware, CONTRACT_GET_API);
    app.get('/contracts/:id', AuthenticateMiddleware, CONTRACT_GET_ID_API);
    app.delete('/contracts/:id', AuthenticateMiddleware, CONTRACT_DELETE_API);
    app.patch('/contracts/:id', AuthenticateMiddleware, ContractActiveMiddleware, CONTRACT_PATCH_API);
}