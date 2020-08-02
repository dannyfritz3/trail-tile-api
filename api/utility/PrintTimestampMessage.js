const printTimestampMessage = (message) => {
    console.log(new Date().toString() + ": " + message);
};

module.exports = printTimestampMessage;