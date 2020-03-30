var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrailSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    condition: {
        type: String,
        default: ''
    },
    adminComments: {
        type: String,
        default: ''
    },
    adminName: {
        type: String,
        default: ''
    },
    timestamp: {
        type: String,
        default: ''
    },
    parsedTimestamp: {
        type: String,
        default: ''
    },
    reimtbX: {
        type: String,
        defualt: ''
    },
    reimtbY: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Trails', TrailSchema);