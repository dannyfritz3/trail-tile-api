var axios = require('axios');
var express = require('express');
const weatherService = require("./api/services/WeatherService");
const locationService = require("./api/services/LocationService");
const trailService = require("./api/services/TrailService");
const printTimestampMessage = require('./api/utility/PrintTimestampMessage');

var exec = require('child_process').exec, child;
var path = require('path');
console.log(path.resolve(process.cwd(), '.'));
var app = express();
const port = process.env.PORT || 4000;
var bodyParser = require('body-parser');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ping test
app.get("/ping", (req, res, next) => {
    res.sendStatus(200);
});

//get all trails
app.get("/getAllTrails", async (req, res, next) => {
    printTimestampMessage("getAllTrails requested.");
    var trailDataResponse = await trailService.getAllTrails()
    res.json(trailDataResponse);
});

//get bulliten board for a specific trail
app.get("/getBulletinBoard/:trailId", async (req, res, next) => {
    printTimestampMessage("getBulletinBoardByTrailId requested.");
    var bulletinBoard_json = await trailService.getBulletinBoardByTrailId(req.params.trailId);
    res.json(bulletinBoard_json);
});

//post a message to a trail's bulletin board
app.post("/postBulletinMessage/:trailId", (req, res, next) => {
    var trailId = req.params.trailId;
    var bulletinPost = req.body;
    trailService.postBulletinMessage(trailId, bulletinPost)
    printTimestampMessage("Post request recieved: " + req.body);
});

//get specific trail based on id
app.get("/getTrailById/:trailId", async (req, res) => {
    printTimestampMessage("Request for trail " + req.params.trailId + " received.")
    var trail_json = await trailService.getTrailById(req.params.trailId);
    res.json(trail_json);
});

app.get("/getWeatherData/:location", async (req, res) => {
    printTimestampMessage("Request for trail weather data requested for location \"" + req.params.location + "\" received.")
    const locationCoordinates = await locationService.getLocationCoordinates(req.params.location)
    const liveWeatherData = await weatherService.getWeatherDataByCoordinates(locationCoordinates.data[0]);
    const forecastedWeatherData = await weatherService.getForecastedWeatherData(locationCoordinates.data[0]);
    res.json({
        "forecastedWeatherData": forecastedWeatherData.data.slice(0, 5),
        "liveWeatherData": liveWeatherData.data
    });
});

setInterval(() => {
    child = exec('python ./data-collection/MorcScraperService_mongo.py', (error) => {
        if(error !== null) {
            console.log('EXECUTION ERROR: ' + error);
        }
    });       
    printTimestampMessage("Databse updated.");
}, 10000);

app.listen(port, () => {
    console.log("Server running on port " + port);
});