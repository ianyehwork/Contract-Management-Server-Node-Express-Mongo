// Controller import
const { PARKING_LOT_POST_API, PARKING_LOT_GET_API, PARKING_LOT_GET_ID_API, PARKING_LOT_DELETE_API, PARKING_LOT_PATCH_API} = require('../controllers/parking-lot-api');
// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');
const ParkingLotDeleteMiddleware = require('../middleware/parking-lot-delete');
module.exports = (app) => {
    // Customer Routes Definition
    app.post('/parkinglots', AuthenticateMiddleware, PARKING_LOT_POST_API);
    app.get('/parkinglots', AuthenticateMiddleware, PARKING_LOT_GET_API);
    app.get('/parkinglots/:id', AuthenticateMiddleware, PARKING_LOT_GET_ID_API);
    app.delete('/parkinglots/:id', AuthenticateMiddleware, ParkingLotDeleteMiddleware, PARKING_LOT_DELETE_API);
    app.patch('/parkinglots/:id', AuthenticateMiddleware, PARKING_LOT_PATCH_API);
}