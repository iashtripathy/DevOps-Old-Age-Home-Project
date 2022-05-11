const {
    createLogger,
    transports,
    format
} = require("winston");

const logger = createLogger({

    transports: [
        new transports.File({
            filename: 'orphan.log',
            //format: format.timestamp(),
            format: format.combine(format.timestamp(), format.json())
            //json: false
        })
    ]
});



module.exports = logger;