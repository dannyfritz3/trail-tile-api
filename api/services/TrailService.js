var trailDbAdapter = require('../adapters/TrailDbAdapter');
var printTimestampMessage = require('../utility/PrintTimestampMessage');

const TrailService = {
    "getAllTrails": async () => {
        return await trailDbAdapter.getAllTrails();
    },

    "getTrailById": async (trailId) => {
        return trailDbAdapter.getTrailById(trailId);
    },

    "postBulletinMessage": async (trailId, bulletinPost) => {
        trailDbAdapter.postBulletinMessage(trailId, bulletinPost);
    },

    "getBulletinBoardByTrailId": async (trailId) => {
        return trailDbAdapter.getBulletinBoardByTrailId(trailId);
    }
};

module.exports = TrailService;