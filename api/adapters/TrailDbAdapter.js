// const { MongoClient } = require('mongodb');
// const uri = 'mongodb+srv://dbUser:1234password@morc-trail-cluster-2oaql.gcp.mongodb.net/test?retryWrites=true&w=majority';
// var dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var trail_data;

var mongoose = require('mongoose');
var mongoDB = 'mongodb://dbUser:1234password@morc-trail-cluster-shard-00-00-2oaql.gcp.mongodb.net:27017,morc-trail-cluster-shard-00-01-2oaql.gcp.mongodb.net:27017,morc-trail-cluster-shard-00-02-2oaql.gcp.mongodb.net:27017/<dbname>?ssl=true&replicaSet=MORC-TRAIL-CLUSTER-shard-0&authSource=admin&retryWrites=true&w=majority'
var dbClient = mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect()
var connectToDb = async () => {
    //dbClient = await dbClient.connect();
    trail_data = await dbClient.db('trail_data').collection('trails').find({}).toArray();
};

const TrailDbAdapter = {
    "getAllTrails": async () => {
        await connectToDb();
        // var GetAllTrailsResponse = new GetAllTrailsResponse();
        // for(var trail in trail_data) {
        //     var trailModel = new Trail({
        //         name: "test",
        //         condition: "test",
        //         comments: "test",
        //         username: "test"
        //     });
        //     GetAllTrailsResponse.trailList.push(trailModel);
        // }
        // return GetAllTrailsResponse;
        mongoose.model('users', {name: String});
    },

    "getTrailById": async (trailId) => {
        await connectToDb();
        var trail = trail_data.find(trail => trail.trail_id == trailId);
        if (trail) {
            return(trail);
        } else {
           return({"message": `No trail found with the id: ${trailId})`});
        }
    },

    "postBulletinMessage": async (trailId, bulletinPost) => {
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
    },

    "getBulletinBoardByTrailId": async (trailId) => {
        var collection = dbClient.db('bulletindb').collection('bulletin-boards');
        collection.findOne({ trail_id: trailId }).then(document => {
            if (!document) {
                return {};
            } else {
                return document.bulletinPosts;
            }
        });
    }
}

module.exports = TrailDbAdapter;