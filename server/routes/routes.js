// Concrete Routes Import
const PosterRoutes = require('./poster-routes');
const UserRoutes = require('./user-routes');
const CustomerRoutes = require('./customer-routes');
const ParkingAreaRoutes = require('./parking-area-routes');
const ParkingLotRoutes = require('./parking-lot-routes');
const ContractRoutes = require('./contract-routes');

module.exports = (app) => {
    // App Routes Definition
    PosterRoutes(app);
    UserRoutes(app);
    CustomerRoutes(app);
    ParkingAreaRoutes(app);
    ParkingLotRoutes(app);
    ContractRoutes(app);
}