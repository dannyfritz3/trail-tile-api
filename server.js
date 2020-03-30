var express = require('express');
const { MongoClient } = require('mongodb');
var app = express();
const port = process.env.PORT || 4000;
var bodyParser = require('body-parser');
var trail_data;

async function connectToDb() {
    const uri = 'mongodb+srv://dbUser:1234password@morc-trail-cluster-2oaql.gcp.mongodb.net/test?retryWrites=true&w=majority';
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    trail_data = await client.db('trail_data').collection('trails').find({}).toArray();
}

connectToDb();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

//ping test
app.get("/ping", (req, res, next) => {
    res.sendStatus(200);
});

//get all trails
app.get("/trails", (req, res, next) => {
    connectToDb();
    console.log(new Date().toString() + ": Request for all trails received.")
    res.json(trail_data);
});

//get specific trail based on id
app.get("/trails/:trailId", (req, res) => {
    connectToDb();
    console.log(new Date().toString() + ": Request for trail " + req.params.trailId + " received.")
    var trail = trail_data.find(trail => trail.trail_id == req.params.trailId);
    if(trail) {
        res.json(trail);
    } else {
        res.send("No trail found with the id: " + req.params.trailId);
    }
});

app.listen(port, () => {
    console.log("Server running on port " + port);
});