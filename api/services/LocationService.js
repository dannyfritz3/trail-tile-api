var locationAdapter = require("../adapters/LocationAdapter");

const LocationService = {
    "getLocationByCoordinates": async (locationCoordinates) => {
        locationAdapter.getLocationByCoordinates(locationCoordinates);
    }
};

module.exports = LocationService;