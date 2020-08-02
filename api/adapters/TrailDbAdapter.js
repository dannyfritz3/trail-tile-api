const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://dbUser:1234password@morc-trail-cluster-2oaql.gcp.mongodb.net/test?retryWrites=true&w=majority';
var dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var trail_data;

var connectToDb = async () => {
    dbClient = await dbClient.connect();
    trail_data = await dbClient.db('trail_data').collection('trails').find({}).toArray();
};

const TrailDbAdapter = {
    "getAllTrails": async () => {
        await connectToDb();
        return trail_data;
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