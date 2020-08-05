const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trail = require("./Trail");

const GetAllTrailsResponse = new Schema({
    trailList: {
        type: [Trail],
        default: []
    }
});

mongoose.model("GetAllTrailsResponse", GetAllTrailsResponse);