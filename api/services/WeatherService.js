var weatherAdapter = require("../adapters/WeatherAdapter");
var locationService = require("./LocationService");

const WeatherService = {
    "getWeatherDataByLocationName": async (locationName) => {
        const locationCoordinates = await locationService.getLocationCoordinates(locationName);
        const forecastedWeatherData = await weatherAdapter.getForecastedWeatherDataByCoordinates(locationCoordinates.data[0]);
        const liveWeatherData = await weatherAdapter.getLiveWeatherDataByCoordinates(locationCoordinates.data[0]);

        return {
            "forecastedWeatherData": forecastedWeatherData.data.slice(0, 5),
            "liveWeatherData": liveWeatherData.data
        }
    },

    "getWeatherDataByLocationCoordinates": async (locationCoordinates) => {
        const forecastedWeatherData = await weatherAdapter.getForecastedWeatherDataByCoordinates(locationCoordinates);
        const liveWeatherData = await weatherAdapter.getLiveWeatherDataByCoordinates(locationCoordinates);
        return {
            "forecastedWeatherData": forecastedWeatherData.slice(0,5),
            "liveWeatherData": liveWeatherData
        }
    }
};

module.exports = WeatherService;