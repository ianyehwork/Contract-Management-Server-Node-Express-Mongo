// Controller import
const { PARKING_AREA_POST_API, PARKING_AREA_GET_API, PARKING_AREA_GET_ID_API, PARKING_AREA_DELETE_API, PARKING_AREA_PATCH_API} = require('../controllers/parking-area-api');
// Middleware import
const AdminAuthenticateMiddleware = require('../middleware/authenticate-admin');
const ParkingAreaDeleteMiddleware = require('../middleware/parking-area-delete');

module.exports = (app) => {
    // Customer Routes Definition
    app.post('/parkingareas', AdminAuthenticateMiddleware, PARKING_AREA_POST_API);
    app.get('/parkingareas', AdminAuthenticateMiddleware, PARKING_AREA_GET_API);
    app.get('/parkingareas/:id', AdminAuthenticateMiddleware, PARKING_AREA_GET_ID_API);
    app.delete('/parkingareas/:id', AdminAuthenticateMiddleware, ParkingAreaDeleteMiddleware, PARKING_AREA_DELETE_API);
    app.patch('/parkingareas/:id', AdminAuthenticateMiddleware, PARKING_AREA_PATCH_API);
}