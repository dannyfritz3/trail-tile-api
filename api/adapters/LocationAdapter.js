var axios = require('axios');
const locationIqKey = '01edee523b4595';

const LocationAdapter = {
    "getLocationByCoordinates": async (locationCoordinates) => {
        return await axios.get(`https://us1.locationiq.com/v1/search.php?key=${locationIqKey}&q=${locationCoordinates}&format=json`);
    }
};

module.exports = LocationAdapter;