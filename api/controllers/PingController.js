const appInstance;

const PingController = (app) => {
    appInstance = app;
    
    app.get("/ping", (req, res, next) => {
        res.sendStatus(200);
    });
}

module.exports = PingController;