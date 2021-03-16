var trail_data;
var mongodbUrl = 'mongodb://dbUser:1234password@morc-trail-cluster-shard-00-00-2oaql.gcp.mongodb.net:27017,morc-trail-cluster-shard-00-01-2oaql.gcp.mongodb.net:27017,morc-trail-cluster-shard-00-02-2oaql.gcp.mongodb.net:27017/<dbname>?ssl=true&replicaSet=MORC-TRAIL-CLUSTER-shard-0&authSource=admin&retryWrites=true&w=majority'
const mongoClient = require('mongodb').MongoClient;

var connectToDb = async () => {
    //dbClient = await dbClient.connect();
    mongoClient.connect(mongodbUrl, async (err, client) => {
        if (err) {
            throw err;
        }
    
        trail_data = await client.db('trail_data').collection('trails').find({}).toArray();
        client.close();
    });
};

const TrailDbAdapter = {
    "getAllTrails": async () => {
        await connectToDb();
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
        mongoClient.connect(mongodbUrl, (err, client) => {
            if (err) {
                throw err;
            }
            var collection = client.db('bulletindb').collection('bulletin-boards');
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
            client.close();
        });
    },

    "getBulletinBoardByTrailId": async (trailId) => {
        mongoClient.connect(mongodbUrl, (err, client) => {
            if (err) {
                throw err;
            }
            var collection = client.db('bulletindb').collection('bulletin-boards');
            collection.findOne({ trail_id: trailId }).then(document => {
                if (!document) {
                    return {};
                } else {
                    return document.bulletinPosts;
                }
            });
            client.close();
        });        
    }
}

module.exports = TrailDbAdapter;