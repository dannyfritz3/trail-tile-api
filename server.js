var axios = require('axios');
var express = require('express');
const { MongoClient } = require('mongodb');
var app = express();
const port = process.env.PORT || 4000;
var bodyParser = require('body-parser');
var trail_data;
var dbClient;

async function connectToDb() {
    const uri = 'mongodb+srv://dbUser:1234password@morc-trail-cluster-2oaql.gcp.mongodb.net/test?retryWrites=true&w=majority';
    dbClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    dbClient = await dbClient.connect();
    trail_data = await dbClient.db('trail_data').collection('trails').find({}).toArray();
}

connectToDb();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

const printTimestampMessage = (message) => {
    console.log(new Date().toString() + ": " + message);
}
//ping test
app.get("/ping", (req, res, next) => {
    res.sendStatus(200);
});

//get all trails
app.get("/trails", (req, res, next) => {
    connectToDb();
    printTimestampMessage("Request for all trails received.");
    res.json(trail_data);
});

//get bulliten board for a specific trail
app.get("/getBulletinBoard/:trailId", (req, res, next) => {
    var trailId = req.params.trailId;
    var collection = dbClient.db('bulletindb').collection('bulletin-boards');
    collection.findOne({trail_id: trailId}).then(document => {
        if(!document) {
            res.json({});
        } else {
            res.json(document.bulletinPosts);
        }
    });
    printTimestampMessage("Get bulletin board requested.");
});

//post a message to a trail's bulletin board
app.post("/postBulletinMessage/:trailId", (req, res, next) => {
    var trailId = req.params.trailId;
    var bulletinPost = req.body;
    var collection = dbClient.db('bulletindb').collection('bulletin-boards');
    collection.findOne({ "trail_id": trailId }).then(document => {
        if (!document) {
            printTimestampMessage("Document doesn't exist.\nCreating new document.");
            collection.insertOne({
                trail_id: trailId,
                bulletinPosts: [bulletinPost]
            });
        } else {
            collection.updateOne(
                { trail_id: trailId },
                { $push: { bulletinPosts: bulletinPost } }
            );
            printTimestampMessage("Document updated.")
        }
    });
    printTimestampMessage("Post request recieved: " + req.body);
});

//get specific trail based on id
app.get("/trails/:trailId", (req, res) => {
    connectToDb();
    printTimestampMessage("Request for trail " + req.params.trailId + " received.")
    var trail = trail_data.find(trail => trail.trail_id == req.params.trailId);
    if(trail) {
        res.json(trail);
    } else {
        res.send("No trail found with the id: " + req.params.trailId);
    }
});

app.get("/getWeatherData/:location", (req, res) => {
    var startDate = '2020-04-12T00:00:00';
    var endDate = '2020-04-13T00:00:00';
    var location = req.params.location;
    var key = 'EKWA22NR2A9RY0MHJ4C3MJFJG';

    axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history` + 
                `?location=${location}` + 
                `&aggregateHours=24` + 
                `&startDateTime=${startDate}` + 
                `&endDateTime=${endDate}` + 
                `&key=${key}` + 
                `&contentType=json`).then((response) => {
        var responseObject = response.data.locations[Object.keys(response.data.locations)[0]];
        res.send(responseObject);
    });

});

app.listen(port, () => {
    console.log("Server running on port " + port);
});