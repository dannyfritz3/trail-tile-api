var axios = require('axios');
const climacellKey = '1OwEaPcEHqfKpUTeHZUfMOyK3nyz3PcY';

const WeatherAdapter = {
    "getLiveWeatherDataByCoordinates": async (locationCoordinates) => {
        var lat = locationCoordinates.lat;
        var lon = locationCoordinates.lon;
        var fieldsArray = ["temp", "weather_code", "wind_speed", "wind_direction", "precipitation"];
        var url = `https://api.climacell.co/v3/weather/realtime?apikey=${climacellKey}&lat=${lat}&lon=${lon}&fields=${fieldsArray}&unit_system=us`;
        var response = await axios.get(url);
        return response.data;
    },
    "getForecastedWeatherDataByCoordinates": async (locationCoordinates) => {
        var lat = locationCoordinates.lat;
        var lon = locationCoordinates.lon;
        var fieldsArray = ["temp", "weather_code", "wind_speed", "wind_direction", "precipitation_accumulation"]
        var url = `https://api.climacell.co/v3/weather/forecast/daily?apikey=${climacellKey}&lat=${lat}&lon=${lon}&fields=${fieldsArray}&unit_system=us`;
        var response = await axios.get(url);
        return response.data;
    }
}

module.exports = WeatherAdapter;