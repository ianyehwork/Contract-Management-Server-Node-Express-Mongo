// Controller import
const { PARKING_AREA_POST_API, PARKING_AREA_GET_API, PARKING_AREA_GET_ID_API, PARKING_AREA_DELETE_API, PARKING_AREA_PATCH_API} = require('../controllers/parking-area-api');
// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');
const ParkingAreaDeleteMiddleware = require('../middleware/parking-area-delete');

module.exports = (app) => {
    // Customer Routes Definition
    app.post('/parkingareas', AuthenticateMiddleware, PARKING_AREA_POST_API);
    app.get('/parkingareas', AuthenticateMiddleware, PARKING_AREA_GET_API);
    app.get('/parkingareas/:id', AuthenticateMiddleware, PARKING_AREA_GET_ID_API);
    app.delete('/parkingareas/:id', AuthenticateMiddleware, ParkingAreaDeleteMiddleware, PARKING_AREA_DELETE_API);
    app.patch('/parkingareas/:id', AuthenticateMiddleware, PARKING_AREA_PATCH_API);
}