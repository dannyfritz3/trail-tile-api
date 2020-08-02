var weatherAdapter = require("../adapters/WeatherAdapter");

const WeatherService = {
    "getWeatherDataByCoordinates": async (locationCoordinates) => {
        return weatherAdapter.getWeatherDataByCoordinates(locationCoordinates);
    },

    "getForecasterWeatherData": async (locationCoordinates) => {
        return weatherAdapter.getForecastedWeatherData(locationCoordinates);
    }
};

module.exports = WeatherService;