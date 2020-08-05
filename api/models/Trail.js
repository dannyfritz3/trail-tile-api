const { Int32 } = require("mongodb");

const mongoose = require(mongoose);
const Schema = mongoose.Schema;

const Trail = new Schema({
    name: {type: String, default: ""}, 
    condition: {type: String, default: ""},
    comments: {type: String, default: ""},
    username: {type: String, default: ""}, 
    timestamp: {type: String, default: ""},
    parsedTimestamp: {type: String, default: ""},
    location: {type: String, default: ""}, 
    trailforksMapId: {type: String, default: ""},
    reimtbX: {type: String, default: ""},
    reimtbY: {type: String, default: ""}, 
    trail_id: {type: Number, default: 0},
    lat: {type: String, default: ""},
    lon: {type: String, default: ""}
});

mongoose.model("Trail", Trail);